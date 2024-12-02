import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createPineconeIndex } from './pinecone-client.js';

export async function embedAndStoreDocs(
  client,
  docs
) {
  /*create and store the embeddings in the vectorStore*/
  try {
    await createPineconeIndex(client, process.env.PINECONE_INDEX_NAME);
    const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-small",
    });
    const index = client.Index(process.env.PINECONE_INDEX_NAME);

    //embed the PDF documents
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      textKey: 'text',
    });
  } catch (error) {
    console.log('error ', error);
    throw new Error('Failed to load your docs !');
  }
}

// Returns vector-store handle to be used a retrievers on langchains
export async function getVectorStore(client) {
  try {
    const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-small",
    });
    const index = client.Index(process.env.PINECONE_INDEX_NAME);

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      textKey: 'text',
    });

    return vectorStore;
  } catch (error) {
    console.log('error ', error);
    throw new Error('Something went wrong while getting vector store !');
  }
}