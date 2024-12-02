import { Message } from "ai";



export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


export const initialMessages = [
  {
    role: "assistant",
    id: "0",
    content:
      "Hi! I am your AI tour guide. I am here to answer questions on black events in London, Paris and Dubai.",
  },
];


// Maps the sources with the right ai-message
export const getSources = (data, role, index) => {
  if (role === "assistant" && index >= 2 && (index - 2) % 2 === 0) {
    const sourcesIndex = (index - 2) / 2;
    if (data[sourcesIndex] && data[sourcesIndex].sources) {
      return data[sourcesIndex].sources;
    }
  }
  return [];
};