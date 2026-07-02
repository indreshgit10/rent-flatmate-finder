const ChatMessage = require('../models/ChatMessage');
const InterestRequest = require('../models/InterestRequest');
const AppError = require('../utils/AppError');

const getMessagesByInterest = async (interestId, userId) => {
  const request = await InterestRequest.findById(interestId);
  if (!request) {
    throw new AppError('Interest request not found', 404);
  }

  if (request.tenant.toString() !== userId.toString() && request.owner.toString() !== userId.toString()) {
    throw new AppError('Not authorized to view this chat', 403);
  }

  const messages = await ChatMessage.find({ interestRequest: interestId })
    .populate('sender', 'name role')
    .sort({ createdAt: 1 })
    .lean();

  return messages;
};

module.exports = { getMessagesByInterest };
