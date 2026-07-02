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

const getSentInterests = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await interestService.getSentInterests(req.user.id, page, limit);
    sendSuccess(res, 'Sent interests retrieved', result);
  } catch (error) {
    next(error);
  }
};

const acceptInterest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const request = await interestService.acceptInterest(id, req.user.id);
    sendSuccess(res, 'Interest request accepted', request);
  } catch (error) {
    next(error);
  }
};

const declineInterest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const request = await interestService.declineInterest(id, req.user.id);
    sendSuccess(res, 'Interest request declined', request);
  } catch (error) {
    next(error);
  }
};

module.exports = { sendInterest, getReceivedInterests, getSentInterests, acceptInterest, declineInterest };
