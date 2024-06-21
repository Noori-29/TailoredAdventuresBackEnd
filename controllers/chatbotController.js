const Chatbot = require('../models/chatbot');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Handle chatbot queries
const handleChatQuery = async (req, res) => {
  const { question } = req.body;

  try {
    // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content based on the user's question
    const result = await model.generateContent(question);
    const response = await result.response;
    const answer = await response.text();

    // Save the question and answer to the database
    const chat = new Chatbot({ question, answer });
    await chat.save();

    // Return the question and answer as a response
    res.status(201).json(chat);
  } catch (error) {
    console.error('Error handling chat query:', error);
    res.status(500).json({
      error: 'Failed to handle chat query',
      details: error.message || error.response.data,
    });
  }
};

// Fetch all chat history
const getAllChats = async (req, res) => {
  try {
    const chats = await Chatbot.find();
    res.status(200).json(chats);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

module.exports = {
  handleChatQuery,
  getAllChats,
};
