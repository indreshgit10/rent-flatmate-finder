const User = require('../models/User');
const Listing = require('../models/Listing');
const AppError = require('../utils/AppError');

const getUsers = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const users = await User.find({})
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit, 10))
    .lean();

  const totalCount = await User.countDocuments({});

  return {
    users,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: parseInt(page, 10)
  };
};

const disableUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);
  
  if (user.role === 'admin') {
    throw new AppError('Cannot disable an admin account', 400);
  }
  
  user.isDisabled = true;
  await user.save();
  return user;
};

const enableUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);
  
  user.isDisabled = false;
  await user.save();
  return user;
};

const getAllListings = async (page = 1, limit = 10, filters = {}) => {
  const skip = (page - 1) * limit;

  const query = {};
  if (filters.location) {
    query.location = { $regex: filters.location, $options: 'i' };
  }

  const listings = await Listing.find(query)
    .populate('owner', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit, 10))
    .lean();

  const totalCount = await Listing.countDocuments(query);

  return {
    listings,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: parseInt(page, 10)
  };
};

module.exports = { getUsers, disableUser, enableUser, getAllListings };
