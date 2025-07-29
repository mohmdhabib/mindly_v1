import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { Document } from 'langchain/document';
import { loadQAStuffChain } from 'langchain/chains';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import pdf from 'pdf-parse/lib/pdf-parse';

const model = new ChatGoogleGenerativeAI({
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  model: 'gemini-1.5-flash',
  temperature: 0.7,
});

export const generateResponse = async (
  prompt: string,
  history: any[],
  systemContext: string,
  fileUrl?: string | null
) => {
  if (fileUrl) {
    const response = await fetch(fileUrl);
    const buffer = await response.arrayBuffer();
    const data = await pdf(buffer);

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await textSplitter.splitDocuments([
      new Document({ pageContent: data.text }),
    ]);

    const chain = loadQAStuffChain(model);
    const res = await chain.invoke({
      input_documents: docs,
      question: prompt,
    });

    return res.text;
  } else {
    const chatPrompt = `${systemContext}\n\n${history
      .map((h) => `${h.role}: ${h.content}`)
      .join('\n')}\n\nuser: ${prompt}`;

    const response = await model.invoke(chatPrompt);
    return response.content;
  }
};
