const listingService = require('../services/listingService');
const { sendSuccess } = require('../utils/apiResponse');

const createListing = async (req, res, next) => {
  try {
    const backendUrl = `${req.protocol}://${req.get('host')}`;
    const photos = req.files ? req.files.map(file => `${backendUrl}/uploads/${file.filename}`) : [];
    const listingData = { ...req.body, photos };
    const listing = await listingService.createListing(req.user.id, listingData);
    sendSuccess(res, 'Listing created', listing, 201);
  } catch (err) { next(err); }
};

const getListings = async (req, res, next) => {
  try {
    const result = await listingService.getListings(req.query);
    sendSuccess(res, 'Listings retrieved', result);
  } catch (err) { next(err); }
};

const getOwnerListings = async (req, res, next) => {
  try {
    // A quick fetch directly using the service or we can add a method to listingService
    // We will add getOwnerListings to the service
    const result = await listingService.getOwnerListings(req.user.id, req.query);
    sendSuccess(res, 'Owner listings retrieved', result);
  } catch (err) { next(err); }
};

const getListingById = async (req, res, next) => {
  try {
    const listing = await listingService.getListingById(req.params.id);
    sendSuccess(res, 'Listing retrieved', listing);
  } catch (err) { next(err); }
};

const updateListing = async (req, res, next) => {
  try {
    const listingData = { ...req.body };
    if (req.files && req.files.length > 0) {
      const backendUrl = `${req.protocol}://${req.get('host')}`;
      listingData.photos = req.files.map(file => `${backendUrl}/uploads/${file.filename}`);
    }
    const listing = await listingService.updateListing(req.params.id, req.user.id, listingData);
    sendSuccess(res, 'Listing updated', listing);
  } catch (err) { next(err); }
};

const markAsFilled = async (req, res, next) => {
  try {
    const listing = await listingService.markAsFilled(req.params.id, req.user.id);
    sendSuccess(res, 'Listing marked as filled', listing);
  } catch (err) { next(err); }
};

const deleteListing = async (req, res, next) => {
  try {
    await listingService.deleteListing(req.params.id, req.user.id);
    sendSuccess(res, 'Listing deleted');
  } catch (err) { next(err); }
};

module.exports = { createListing, getListings, getOwnerListings, getListingById, updateListing, markAsFilled, deleteListing };
