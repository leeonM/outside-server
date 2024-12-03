import { ConversationalRetrievalQAChain } from "langchain/chains";
import { getVectorStore } from "./vector-store.js";
import {
  StreamingTextResponse,
  experimental_StreamData,
  LangChainStream,
} from "ai-stream-experimental";
import { streamingModel, nonStreamingModel } from "./llm.js";
import { Pinecone } from "@pinecone-database/pinecone";
import {
  QA_TEMPLATE,
  STANDALONE_QUESTION_TEMPLATE,
} from "./prompt-templates.js";

const client = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

export async function callChain(question, chatHistory) {
  try {
    console.log('Starting callChain');
    const sanitizedQuestion = question.question.trim().replaceAll("\n", " ");
    const vectorStore = await getVectorStore(client);

    const chain = ConversationalRetrievalQAChain.fromLLM(
      streamingModel,
      vectorStore.asRetriever(),
      {
        qaTemplate: QA_TEMPLATE,
        questionGeneratorTemplate: STANDALONE_QUESTION_TEMPLATE,
        returnSourceDocuments: true,
        questionGeneratorChainOptions: {
          llm: nonStreamingModel,
        },
      }
    );

    const result = await chain.invoke({
      question: sanitizedQuestion,
      chat_history: chatHistory || [],
    });

    // Format the response for useChat hook
    return {
      role: "assistant",
      content: result.text || result.answer || ''
    };

  } catch (e) {
    console.error('CallChain error:', e);
    throw new Error("Call chain method failed to execute successfully!!");
  }
}