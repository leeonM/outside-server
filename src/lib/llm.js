import { ChatOpenAI } from "@langchain/openai";

export const streamingModel = new ChatOpenAI({
    modelName: "o1-mini-2024-09-12",
    streaming: true,
    verbose: true,
    temperature: 0.5,
})

export const nonStreamingModel = new ChatOpenAI({
    modelName: "o1-mini-2024-09-12",
    verbose: true,
    temperature: 0.5,
})