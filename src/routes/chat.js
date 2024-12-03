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

    return res.json(result.response);

  } catch (error) {
    console.error("Internal server error:", error);
    return res.status(500).json({ error: "Something went wrong. Try again!" });
  }
});

export default router;
