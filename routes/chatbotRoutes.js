const express = require('express');
const { handleChatQuery, getAllChats } = require('../controllers/chatbotController');

const router = express.Router();

router.post('/query', handleChatQuery);
router.get('/history', getAllChats);

module.exports = router;
