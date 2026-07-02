const CompatibilityScore = require('../models/CompatibilityScore');
const Listing = require('../models/Listing');
const TenantProfile = require('../models/TenantProfile');
const { getCompatibilityScore } = require('./geminiService');
const { computeRuleBasedScore } = require('./ruleBasedScoringService');
const AppError = require('../utils/AppError');

const getScoreForListing = async (tenantUserId, listingId) => {
  const existingScore = await CompatibilityScore.findOne({
    tenant: tenantUserId,
    listing: listingId
  });

  if (existingScore) {
    return existingScore;
  }

  const listing = await Listing.findById(listingId);
  if (!listing) {
    throw new AppError('Listing not found', 404);
  }

  const tenantProfile = await TenantProfile.findOne({ tenant: tenantUserId });
  if (!tenantProfile) {
    throw new AppError('Tenant profile required to compute compatibility', 400);
  }

  let result;
  try {
    const aiResult = await getCompatibilityScore(listing, tenantProfile);
    result = {
      ...aiResult,
      source: 'ai'
    };
  } catch (err) {
    console.error('[Compatibility Fallback]', err.message);
    result = computeRuleBasedScore(listing, tenantProfile);
  }

  const newScore = await CompatibilityScore.create({
    tenant: tenantUserId,
    listing: listingId,
    score: result.score,
    explanation: result.explanation,
    source: result.source
  });

  return newScore;
};

module.exports = { getScoreForListing };
