const chatService = require('../services/chatService');
const { sendSuccess } = require('../utils/apiResponse');

const getMessages = async (req, res, next) => {
  try {
    const { interestId } = req.params;
    const messages = await chatService.getMessagesByInterest(interestId, req.user.id);
    sendSuccess(res, 'Chat history retrieved', messages);
  } catch (error) {
    next(error);
  }
};

module.exports = { getMessages };
