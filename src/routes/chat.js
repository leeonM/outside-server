import express from "express";
import { callChain } from "../lib/langchain.js";
import { streamText } from "ai";

const router = express.Router();

const formatMessage = (message) => {
  return `${message.role === "user" ? "Human" : "Assistant"}: ${
    message.content
  }`;
};

router.post('/', async (req, res) => {
  try {
    const body = req.body;
    const messages = body.messages || [];
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const question = messages[messages.length - 1]?.content;

    if (!question) {
      return res.status(400).json({ error: "Error: no question in the request" });
    }

    console.log('Starting request');
    const result = await callChain({
      question,
      chatHistory: formattedPreviousMessages.join('\n'),
    });

    // Format response for the AI SDK
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    // Send the message in the format expected by useChat
    res.write(`data: ${JSON.stringify(result)}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error) {
    console.error("Internal server error:", error);
    return res.status(500).json({ error: "Something went wrong. Try again!" });
  }
});

export default router;
