import express from 'express';
import { callChain } from '../lib/langchain.js';

const router = express.Router();

const formatMessage = (message) => {
  return `${message.role === "user" ? "Human" : "Assistant"}: ${message.content}`;
};

router.post('/', async (req, res) => {
  try {
      // Access message information from chat history
      const body = req.body;
      const messages = body.messages || [];
      const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
      const question = messages[messages.length - 1]?.content;

      if (!question) {
          return res.status(400).json({ error: "Error: no question in the request" });
      }

      // Call the chain function and return the response
      const StreamingTextResponse = await callChain({
          question,
          chatHistory: formattedPreviousMessages.join('\n'),
      });

      return res.send({message: StreamingTextResponse});
  } catch (error) {
      console.error("Internal server error:", error);
      return res.status(500).json({ error: "Something went wrong. Try again!" });
  }
});

export default router;