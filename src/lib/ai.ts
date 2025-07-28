import { ChatGoogleGenerativeAI } from '@langchain/google-genai'

const model = new ChatGoogleGenerativeAI({
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  model: 'gemini-2.0-flash-lite',
  temperature: 0.7,
})

export const generateResponse = async (
  prompt: string,
  history: any[],
  systemContext: string,
  uploadedFiles: any[]
) => {
  const fileContent = uploadedFiles
    .map((file) => `File: ${file.path}\n\n${file.content}`)
    .join('\n\n');

  const chatPrompt = `${systemContext}\n\n${fileContent}\n\n${history
    .map((h) => `${h.role}: ${h.content}`)
    .join('\n')}\n\nuser: ${prompt}`;

  const response = await model.invoke(chatPrompt);
  return response.content;
};
