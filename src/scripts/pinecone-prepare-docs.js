import { Pinecone } from "@pinecone-database/pinecone";
import { embedAndStoreDocs } from "../lib/vector-store.js";
import { getChunkedDocsFromPDF } from "../lib/pdf-loader.js";

// This operation might fail because indexes likely need
// more time to init, so give some 5 mins after index
// creation and try again.

const client = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

(async () => {
  try {
    console.log("Preparing chunks from PDF file");
    const docs = await getChunkedDocsFromPDF();
    console.log(`Loading ${docs.length} chunks into pinecone...`);
    await embedAndStoreDocs(client, docs);
    console.log("Data embedded and stored in pine-cone index");
  } catch (error) {
    console.error("Init client script failed ", error);
  }
})();