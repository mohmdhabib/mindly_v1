import os
import tempfile
import pdfminer.high_level
import numpy as np

from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from sentence_transformers import SentenceTransformer
from supabase import create_client, Client
from dotenv import load_dotenv
import google.generativeai as genai

# Load .env for secrets
load_dotenv()

# Init Flask
app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = tempfile.gettempdir()

# Load keys
SUPABASE_URL = "https://jlyusmjzsviolebrwvvx.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpseXVzbWp6c3Zpb2xlYnJ3dnZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MzY0NzMsImV4cCI6MjA2OTIxMjQ3M30.Rt8Q85sEHrYerPgU4CvEtdB6t0y5bCvcz0bAccFs0TI"
GEMINI_API_KEY = "AIzaSyDDfRq52oNbHjkWjQG31qiPxT7kJT57v_w"

# Init clients
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
genai.configure(api_key=GEMINI_API_KEY)
model = SentenceTransformer('all-MiniLM-L6-v2')

# === Utility Functions ===
def extract_text_from_pdf(pdf_path):
    return pdfminer.high_level.extract_text(pdf_path)

def chunk_text(text, chunk_size=1000):
    return [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]

def get_embeddings(chunks):
    return model.encode(chunks).tolist()

def cosine_similarity(a, b):
    a, b = np.array(a), np.array(b)
    if np.linalg.norm(a) == 0 or np.linalg.norm(b) == 0:
        return 0.0
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

# === Routes ===
@app.route('/process-pdf', methods=['POST'])
def process_pdf():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)

    try:
        text = extract_text_from_pdf(file_path)
        chunks = chunk_text(text)
        embeddings = get_embeddings(chunks)

        # Insert into documents table
        doc_data = {
            'name': filename,
            'url': request.form.get('url', ''),
            'content': text
        }
        doc_insert = supabase.table('documents').insert(doc_data).execute()
        document_id = doc_insert.data[0]['id']

        # Insert chunks into document_chunks
        for chunk, emb in zip(chunks, embeddings):
            chunk_data = {
                'document_id': document_id,
                'chunk_text': chunk,
                'embedding': emb
            }
            supabase.table('document_chunks').insert(chunk_data).execute()

        os.remove(file_path)
        return jsonify({'status': 'success', 'document_id': document_id})
    except Exception as e:
        print('Error processing PDF:', e)
        return jsonify({'error': str(e)}), 500

@app.route('/get-embedding', methods=['POST'])
def get_embedding():
    data = request.get_json()
    text = data.get('text')
    
    if not text:
        return jsonify({'error': 'Missing text'}), 400
    
    try:
        embedding = model.encode([text])[0].tolist()
        return jsonify({'embedding': embedding})
    except Exception as e:
        print('Error getting embedding:', e)
        return jsonify({'error': str(e)}), 500

@app.route('/chat-with-pdf', methods=['POST'])
def chat_with_pdf():
    data = request.get_json()
    document_id = data.get('documentId')
    question = data.get('question')

    if not document_id or not question:
        return jsonify({'error': 'Missing documentId or question'}), 400

    try:
        # Fetch chunks
        chunk_resp = supabase.table('document_chunks')\
            .select('chunk_text')\
            .eq('document_id', document_id)\
            .execute()

        chunks = [row['chunk_text'] for row in chunk_resp.data]

        if not chunks:
            return jsonify({'error': 'No chunks found for document'}), 404

        # Combine all chunks as context
        context = "\n\n---\n\n".join(chunks[:10])  # limit to avoid Gemini cutoff

        prompt = (
            "You are a helpful assistant. Given the following excerpts from a document and a user's question, "
            "answer only using the information provided.\n\n"
            f"Context:\n\"\"\"\n{context}\n\"\"\"\n\n"
            f"Question: {question}\n\n"
            "Answer:"
        )

        gemini_model = genai.GenerativeModel("gemini-1.5-flash")
        gemini_response = gemini_model.generate_content(prompt)
        answer = getattr(gemini_response, 'text', str(gemini_response))

        return jsonify({'answer': answer.strip()})
    except Exception as e:
        print('Error in chat_with_pdf:', e)
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
