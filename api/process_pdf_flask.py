import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import tempfile
import pdfminer.high_level
import google.generativeai as genai
from supabase import create_client, Client
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer



app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = tempfile.gettempdir()
CORS(app)

# Hardcoded keys
SUPABASE_URL = 'https://jlyusmjzsviolebrwvvx.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpseXVzbWp6c3Zpb2xlYnJ3dnZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MzY0NzMsImV4cCI6MjA2OTIxMjQ3M30.Rt8Q85sEHrYerPgU4CvEtdB6t0y5bCvcz0bAccFs0TI'
GEMINI_API_KEY = 'AIzaSyDDfRq52oNbHjkWjQG31qiPxT7kJT57v_w'

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
genai.configure(api_key=GEMINI_API_KEY)

def extract_text_from_pdf(pdf_path):
    return pdfminer.high_level.extract_text(pdf_path)

def chunk_text(text, chunk_size=1000):
    return [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]




def get_embeddings(chunks):
    model = SentenceTransformer('all-MiniLM-L6-v2')
    embeddings = model.encode(chunks)
    return embeddings.tolist()



@app.route('/process-pdf', methods=['POST'])
def process_pdf():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)

    try:
        text = extract_text_from_pdf(file_path)
        chunks = chunk_text(text)
        embeddings = get_embeddings(chunks)

        # Insert into Supabase documents table
        doc_data = {
            'name': filename,
            'url': request.form.get('url', ''),
            'content': text,
            'embedding': embeddings[0] if embeddings else None
        }
        try:
            response = supabase.table('documents').insert(doc_data).execute()
            print('Supabase insert response:', response)
        except Exception as db_err:
            print('Supabase insert error:', db_err)
            os.remove(file_path)
            return jsonify({'status': 'error', 'error': str(db_err)}), 500
        os.remove(file_path)
        if hasattr(response, 'error') and response.error:
            return jsonify({'status': 'error', 'error': str(response.error)}), 500
        return jsonify({'status': 'success', 'document': doc_data, 'supabase_response': str(response)})
    except Exception as e:
        print('Error processing PDF:', e)
        return jsonify({'status': 'error', 'error': str(e)}), 500


# Semantic search utility
import numpy as np
from flask import request

def cosine_similarity(a, b):
    a = np.array(a)
    b = np.array(b)
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

@app.route('/chat-with-pdf', methods=['POST'])
def chat_with_pdf():
    data = request.get_json()
    document_id = data.get('documentId')
    question = data.get('question')
    if not document_id or not question:
        return jsonify({'error': 'Missing documentId or question'}), 400

    try:
        # Fetch document from Supabase
        response = supabase.table('documents').select('content, embedding').eq('id', document_id).execute()
        if not response.data or len(response.data) == 0:
            return jsonify({'error': 'Document not found'}), 404
        doc = response.data[0]
        content = doc['content']
        embedding = doc['embedding']
        if not content or not embedding:
            return jsonify({'error': 'Document missing content or embedding'}), 400

        # Chunk the content again (should match original chunking)
        chunks = chunk_text(content)
        # Get embeddings for all chunks
        model = SentenceTransformer('all-MiniLM-L6-v2')
        chunk_embeddings = model.encode(chunks)
        # Embed the question
        question_embedding = model.encode([question])[0]

        # Find the most similar chunk
        similarities = [cosine_similarity(question_embedding, chunk_emb) for chunk_emb in chunk_embeddings]
        best_idx = int(np.argmax(similarities))
        best_chunk = chunks[best_idx]
        best_score = similarities[best_idx]

        # Use Gemini to generate a human-readable answer
        prompt = (
            "You are an expert assistant. Read the following excerpt from a PDF and answer the user's question as clearly and informatively as possible. "
            "Do not simply repeat the context; instead, provide a concise summary or classification if asked. "
            "If the question is about the subject or type of the PDF, infer and state whether it is about science, math, history, etc. "
            "If the context is a list of facts, summarize the main topic or theme. "
            "Context:\n"
            f"{best_chunk}\n\n"
            f"Question: {question}\n\n"
            "Answer:"
        )
        try:
            gemini_response = genai.generate_content(prompt)
            answer_text = gemini_response.text if hasattr(gemini_response, 'text') else str(gemini_response)
        except Exception as llm_err:
            print('Gemini error:', llm_err)
            answer_text = best_chunk  # fallback to raw chunk
        return jsonify({
            'answer': answer_text,
            'score': float(best_score)
        })
    except Exception as e:
        print('Error in chat_with_pdf:', e)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
