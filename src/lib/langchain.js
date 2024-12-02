import { ConversationalRetrievalQAChain } from "langchain/chains";
import { getVectorStore } from "./vector-store.js";
import {
  StreamingTextResponse,
  experimental_StreamData,
  LangChainStream,
} from "ai-stream-experimental";
import { streamingModel, nonStreamingModel } from "./llm.js";
import { Pinecone } from "@pinecone-database/pinecone";
import { QA_TEMPLATE, STANDALONE_QUESTION_TEMPLATE } from "./prompt-templates.js";


const client = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});

export async function callChain(question, chatHistory ) {
  try {
    // Open AI recommendation
    
    const sanitizedQuestion = question.question.trim().replaceAll("\n", " ");
    const vectorStore = await getVectorStore(client);
    const { stream, handlers } = LangChainStream({
      experimental_streamData: true,
    });
    const data = new experimental_StreamData();

    const chain = ConversationalRetrievalQAChain.fromLLM(
      streamingModel,
      vectorStore.asRetriever(),
      {
        qaTemplate: QA_TEMPLATE,
        questionGeneratorTemplate: STANDALONE_QUESTION_TEMPLATE,
        returnSourceDocuments: true, //default 4
        questionGeneratorChainOptions: {
          llm: nonStreamingModel,
        },
      }
    );

    // Question using chat-history
    // Reference https://js.langchain.com/docs/modules/chains/popular/chat_vector_db#externally-managed-memory
    chain
      .invoke(
        {
          question: sanitizedQuestion,
          chat_history: chatHistory || [],
        },
        [handlers]
      )
      .then(async (res) => {
        const sourceDocuments = res?.sourceDocuments;
        const firstTwoDocuments = sourceDocuments.slice(0, 2);
        const pageContents = firstTwoDocuments.map(
          (pageContent ) => pageContent
        );
        console.log("already appended ", data);
        data.append({
          sources: pageContents,
        });
        data.close();
      });

    // Return the readable stream
    return new StreamingTextResponse(stream, {}, data);
  } catch (e) {
    console.error(e);
    throw new Error("Call chain method failed to execute successfully!!");
  }
}