import { ChatOpenAI } from "@langchain/openai";

export const streamingModel = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    streaming: true,
    verbose: true,
    temperature: 0.5,
})

export const nonStreamingModel = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    verbose: true,
    temperature: 0.5,
})