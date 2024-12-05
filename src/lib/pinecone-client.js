import { Pinecone } from "@pinecone-database/pinecone";


const indexName = process.env.PINECONE_INDEX_NAME;

const client = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});

  
  export const createPineconeIndex = async (client, indexName) => {
      console.log(`Checking ${indexName}`);
  
      // Get list of existing indexes - updated for new API
      const existingIndexes = await client.listIndexes();
      const indexExists = existingIndexes.indexes?.some(index => index.name === indexName);
  
      if (!indexExists) {
          console.log(`Creating ${indexName}`);
          await client.createIndex({
              name: indexName,
              dimension: 3072,
              metric: 'cosine',
              spec: {
                  serverless: {
                      cloud: 'aws',
                      region: 'us-east-1'
                  }
              }
          });
  
          console.log(`Creating index.... please wait for it to finish initializing`);
        //   @ts-ignore
          await new Promise((resolve) => setTimeout(resolve, process.env.INDEX_INIT_TIMEOUT));
      } else {
          console.log(`${indexName} already exists`);
      }
  }


