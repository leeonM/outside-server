import express from 'express';
import cors from 'cors';
import chat from './routes/chat.js';
// import chatStream from './routes/chatStream.js';


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/chat', chat);
// app.use('/api/chat-stream', chatStream);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

