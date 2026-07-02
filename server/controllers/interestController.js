const interestService = require('../services/interestService');
const { sendSuccess } = require('../utils/apiResponse');

const sendInterest = async (req, res, next) => {
  try {
    const { listingId } = req.body;
    const request = await interestService.sendInterest(req.user.id, listingId);
    sendSuccess(res, 'Interest request sent successfully', request, 201);
  } catch (error) {
    next(error);
  }
};

const getReceivedInterests = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await interestService.getReceivedInterests(req.user.id, page, limit);
    sendSuccess(res, 'Received interests retrieved', result);
  } catch (error) {
    next(error);
  }
};

module.exports = { sendInterest, getReceivedInterests };
