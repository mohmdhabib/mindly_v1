import { useState } from 'react'
import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from '@langchain/google-genai'
import { AIMessage, HumanMessage } from '@langchain/core/messages'
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts'
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents'
import { getContext } from '@/lib/context'
import { HISTORY_MESSAGES_KEY } from '@/lib/constants'
import { SMEManager } from '@/lib/sme'

const llm = new ChatGoogleGenerativeAI({
  model: 'gemini-2.0-flash-lite',
  temperature: 0.7,
})

const embeddings = new GoogleGenerativeAIEmbeddings({
  model: 'embedding-001',
})

export const useSME = (smeType: keyof SMEManager['smes']) => {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const smeManager = new SMEManager()
  const sme = smeManager.smes[smeType]

  const prompt = ChatPromptTemplate.fromMessages([
    ['system', sme.prompt],
    new MessagesPlaceholder(HISTORY_MESSAGES_KEY),
    ['human', '{input}'],
  ])

  const chain = createStuffDocumentsChain({
    llm,
    prompt,
  })

  const sendMessage = async (message: string) => {
    setIsLoading(true)

    const history = messages.map((message) => {
      if (message.isUser) {
        return new HumanMessage(message.text)
      } else {
        return new AIMessage(message.text)
      }
    })

    const context = await getContext(message, embeddings, 10)

    const response = await (await chain).invoke({
      [HISTORY_MESSAGES_KEY]: history,
      context,
      input: message,
    })

    

    setMessages((messages) => [
      ...messages,
      { text: message, isUser: true },
      { text: response, isUser: false },
    ])

    setIsLoading(false)
  }

  return {
    isLoading,
    messages,
    sendMessage,
  }
}
