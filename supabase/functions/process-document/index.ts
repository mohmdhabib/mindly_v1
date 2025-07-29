import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
const googleApiKey = Deno.env.get('GOOGLE_API_KEY');

serve(async (req) => {
  const { record } = await req.json();
  const filePath = record.id;

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data: file, error } = await supabase.storage
    .from('documents')
    .download(filePath);

  if (error) {
    console.error('Error downloading file:', error);
    return new Response(JSON.stringify({ error: 'Failed to download file' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const loader = getLoader(filePath, file);
  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const splitDocs = await splitter.splitDocuments(docs);

  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: googleApiKey,
    model: 'embedding-001',
  });

  const vectorStore = new SupabaseVectorStore(embeddings, {
    client: supabase,
    tableName: 'documents',
    queryName: 'match_documents',
  });

  await vectorStore.addDocuments(splitDocs);

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});

function getLoader(filePath, file) {
  const fileExtension = filePath.split('.').pop().toLowerCase();
  switch (fileExtension) {
    case 'pdf':
      // PDFLoader requires a Blob
      return new PDFLoader(file);
    case 'txt':
    case 'md':
      // TextLoader requires a Blob
      return new TextLoader(file);
    case 'html':
      // CheerioWebBaseLoader requires a string
      return new CheerioWebBaseLoader(await file.text());
    default:
      throw new Error(`Unsupported file type: ${fileExtension}`);
  }
}
