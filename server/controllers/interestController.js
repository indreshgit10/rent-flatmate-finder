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

module.exports = { sendInterest };
