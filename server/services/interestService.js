const InterestRequest = require('../models/InterestRequest');
const Listing = require('../models/Listing');
const TenantProfile = require('../models/TenantProfile');
const CompatibilityScore = require('../models/CompatibilityScore');
const AppError = require('../utils/AppError');

const sendInterest = async (tenantId, listingId) => {
  const tenantProfile = await TenantProfile.findOne({ tenant: tenantId });
  if (!tenantProfile) {
    throw new AppError('You must create a tenant profile before sending interest', 400);
  }

  const listing = await Listing.findById(listingId);
  if (!listing) {
    throw new AppError('Listing not found', 404);
  }

  if (listing.owner.toString() === tenantId.toString()) {
    throw new AppError('You cannot express interest in your own listing', 400);
  }

  const existingRequest = await InterestRequest.findOne({ tenant: tenantId, listing: listingId });
  if (existingRequest) {
    throw new AppError('Interest request already sent for this listing', 409);
  }

  const newRequest = await InterestRequest.create({
    tenant: tenantId,
    listing: listingId,
    owner: listing.owner,
    status: 'pending'
  });

  return newRequest;
};

const getReceivedInterests = async (ownerId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const interests = await InterestRequest.find({ owner: ownerId })
    .populate('tenant', 'name email')
    .populate('listing', 'location rent')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit, 10))
    .lean();

  const totalCount = await InterestRequest.countDocuments({ owner: ownerId });

  return {
    interests,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: parseInt(page, 10)
  };
};

const getSentInterests = async (tenantId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const interests = await InterestRequest.find({ tenant: tenantId })
    .populate('listing', 'location rent')
    .populate('owner', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit, 10))
    .lean();

  const totalCount = await InterestRequest.countDocuments({ tenant: tenantId });

  // Attach compatibility scores
  const interestsWithScores = await Promise.all(interests.map(async (interest) => {
    const scoreDoc = await CompatibilityScore.findOne({ 
      tenant: tenantId, 
      listing: interest.listing._id 
    }).lean();
    
    return {
      ...interest,
      compatibilityScore: scoreDoc ? scoreDoc.score : null
    };
  }));

  return {
    interests: interestsWithScores,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: parseInt(page, 10)
  };
};

module.exports = { sendInterest, getReceivedInterests, getSentInterests };
