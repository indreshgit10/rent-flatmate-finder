const InterestRequest = require('../models/InterestRequest');
const Listing = require('../models/Listing');
const TenantProfile = require('../models/TenantProfile');
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

module.exports = { sendInterest };
