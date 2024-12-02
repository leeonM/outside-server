import express from 'express';
import { callChain } from '../lib/langchain.js';

const router = express.Router();

// Utility function to format messages for the chain function
const formatMessage = (message) => {
  return `${message.role === "user" ? "Human" : "Assistant"}: ${message.content}`;
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

    // Set response headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Call the LangChain chain function
    const StreamingTextResponse = await callChain({
      question,
      chatHistory: formattedPreviousMessages.join('\n'),
    });

    // Simulate a stream by sending chunks of the response
    for (const chunk of StreamingTextResponse) {
      res.write(JSON.stringify({ message: chunk }) + '\n'); // Send each chunk as a JSON object followed by a newline
      await new Promise((resolve) => setTimeout(resolve, 200)); // Simulate delay
    }

    res.end(); // Close the stream when done
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).write(JSON.stringify({ error: "Something went wrong. Try again!" }) + '\n');
    res.end();
  }
});

export default router;