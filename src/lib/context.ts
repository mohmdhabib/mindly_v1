import { supabase } from './supabase'
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'

export const getContext = async (
  message: string,
  embeddings: GoogleGenerativeAIEmbeddings,
  topK: number,
) => {
  const queryEmbedding = await embeddings.embedQuery(message)

  const { data, error } = await supabase.rpc('match_documents', {
    query_embedding: queryEmbedding,
    match_count: topK,
  })

  if (error) {
    console.error('Error matching documents:', error)
    return ''
  }

  return data.map((doc: any) => doc.content).join('\n\n')
}
