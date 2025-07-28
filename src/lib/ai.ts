import { ChatGoogleGenerativeAI } from '@langchain/google-genai'

const model = new ChatGoogleGenerativeAI({
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  model: 'gemini-2.0-flash-lite',
  temperature: 0.7,
})

export const generateResponse = async (
  prompt: string,
  history: any[],
  systemContext: string
) => {
  const chatPrompt = `${systemContext}\n\n${history
    .map((h) => `${h.role}: ${h.content}`)
    .join('\n')}\n\nuser: ${prompt}`

  const response = await model.invoke(chatPrompt)
  return response.content
}
