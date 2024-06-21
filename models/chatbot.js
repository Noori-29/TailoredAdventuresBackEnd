const mongoose = require('mongoose');

const ChatbotSchema = new mongoose.Schema({
  question: String,
  answer: String,
}, { timestamps: true });

module.exports = mongoose.model('Chatbot', ChatbotSchema);
