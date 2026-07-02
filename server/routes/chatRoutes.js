const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authenticate = require('../middlewares/auth');

router.get('/:interestId', authenticate, chatController.getMessages);

module.exports = router;
