const adminService = require('../services/adminService');
const { sendSuccess } = require('../utils/apiResponse');

const getUsers = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await adminService.getUsers(page, limit);
    sendSuccess(res, 'Users retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};

const disableUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await adminService.disableUser(id);
    sendSuccess(res, 'User disabled successfully');
  } catch (error) {
    next(error);
  }
};

const enableUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await adminService.enableUser(id);
    sendSuccess(res, 'User enabled successfully');
  } catch (error) {
    next(error);
  }
};

const getAllListings = async (req, res, next) => {
  try {
    const { page, limit, location } = req.query;
    const filters = { location };
    const result = await adminService.getAllListings(page, limit, filters);
    sendSuccess(res, 'Listings retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};

const hideListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    await adminService.hideListing(id);
    sendSuccess(res, 'Listing hidden successfully');
  } catch (error) {
    next(error);
  }
};

const unhideListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    await adminService.unhideListing(id);
    sendSuccess(res, 'Listing unhidden successfully');
  } catch (error) {
    next(error);
  }
};

const getPlatformStats = async (req, res, next) => {
  try {
    const stats = await adminService.getPlatformStats();
    sendSuccess(res, 'Platform statistics retrieved successfully', stats);
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, disableUser, enableUser, getAllListings, hideListing, unhideListing, getPlatformStats };
