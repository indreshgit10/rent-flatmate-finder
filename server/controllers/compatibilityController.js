const compatibilityService = require('../services/compatibilityService');
const { sendSuccess } = require('../utils/apiResponse');

const getScore = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const score = await compatibilityService.getScoreForListing(req.user.id, listingId);
    sendSuccess(res, 'Compatibility score retrieved', score);
  } catch (error) {
    next(error);
  }
};

module.exports = { getScore };
