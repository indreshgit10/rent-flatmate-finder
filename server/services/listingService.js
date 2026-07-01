const Listing = require('../models/Listing');
const AppError = require('../utils/AppError');

const createListing = async (ownerId, data) => {
  const listing = await Listing.create({ owner: ownerId, ...data });
  return listing;
};

const getListings = async ({ location, minBudget, maxBudget, page = 1, limit = 10 }) => {
  const filter = { isFilled: false, isHidden: false };

  if (location) filter.location = { $regex: location, $options: 'i' };
  if (minBudget) filter.rent = { ...filter.rent, $gte: Number(minBudget) };
  if (maxBudget) filter.rent = { ...filter.rent, $lte: Number(maxBudget) };

  const skip = (page - 1) * limit;
  const [listings, totalCount] = await Promise.all([
    Listing.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
    Listing.countDocuments(filter),
  ]);

  return { listings, totalCount, page: Number(page), limit: Number(limit) };
};

const getListingById = async (id) => {
  const listing = await Listing.findById(id).populate('owner', 'name email');
  if (!listing) throw new AppError('Listing not found', 404);
  return listing;
};

const updateListing = async (id, ownerId, data) => {
  const listing = await Listing.findById(id);
  if (!listing) throw new AppError('Listing not found', 404);
  if (listing.owner.toString() !== ownerId) throw new AppError('Forbidden', 403);

  Object.assign(listing, data);
  await listing.save();
  return listing;
};

const markAsFilled = async (id, ownerId) => {
  const listing = await Listing.findById(id);
  if (!listing) throw new AppError('Listing not found', 404);
  if (listing.owner.toString() !== ownerId) throw new AppError('Forbidden', 403);
  if (listing.isFilled) throw new AppError('Listing is already marked as filled', 400);

  listing.isFilled = true;
  await listing.save();

  const CompatibilityScore = require('../models/CompatibilityScore');
  await CompatibilityScore.deleteMany({ listing: id });

  return listing;
};

const deleteListing = async (id, ownerId) => {
  const listing = await Listing.findById(id);
  if (!listing) throw new AppError('Listing not found', 404);
  if (listing.owner.toString() !== ownerId) throw new AppError('Forbidden', 403);

  await listing.deleteOne();
};

module.exports = { createListing, getListings, getListingById, updateListing, markAsFilled, deleteListing };
