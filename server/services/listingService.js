const { getPool } = require('../config/db');
const AppError = require('../utils/AppError');

const createListing = async (ownerId, data) => {
  const pool = getPool();
  const { title, description, location, rent } = data;
  
  const [result] = await pool.query(
    'INSERT INTO Listings (owner_id, title, description, location, monthly_rent) VALUES (?, ?, ?, ?, ?)',
    [ownerId, title, description, location, rent]
  );
  
  const [newListing] = await pool.query('SELECT * FROM Listings WHERE id = ?', [result.insertId]);
  return newListing[0];
};

const getListings = async ({ location, minBudget, maxBudget, page = 1, limit = 10 }) => {
  const pool = getPool();
  let query = 'SELECT * FROM Listings WHERE is_filled = FALSE AND is_hidden = FALSE';
  const queryParams = [];

  if (location) {
    query += ' AND location LIKE ?';
    queryParams.push(`%${location}%`);
  }
  if (minBudget) {
    query += ' AND monthly_rent >= ?';
    queryParams.push(Number(minBudget));
  }
  if (maxBudget) {
    query += ' AND monthly_rent <= ?';
    queryParams.push(Number(maxBudget));
  }

  // Count total for pagination
  const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as totalCount');
  const [countResult] = await pool.query(countQuery, queryParams);
  const totalCount = countResult[0].totalCount;

  // Add pagination
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  const offset = (page - 1) * limit;
  queryParams.push(Number(limit), Number(offset));

  const [listings] = await pool.query(query, queryParams);

  return { listings, totalCount, page: Number(page), limit: Number(limit) };
};

const getListingById = async (id) => {
  const pool = getPool();
  const [listings] = await pool.query(
    `SELECT l.*, u.name as owner_name, u.email as owner_email 
     FROM Listings l 
     JOIN Users u ON l.owner_id = u.id 
     WHERE l.id = ?`,
    [id]
  );
  
  if (listings.length === 0) throw new AppError('Listing not found', 404);
  
  const listing = listings[0];
  // Reformat to match old mongoose nested structure slightly
  listing.owner = { id: listing.owner_id, name: listing.owner_name, email: listing.owner_email };
  delete listing.owner_name;
  delete listing.owner_email;
  
  return listing;
};

const updateListing = async (id, ownerId, data) => {
  const pool = getPool();
  const { title, description, location, rent } = data;
  
  const [existing] = await pool.query('SELECT owner_id FROM Listings WHERE id = ?', [id]);
  if (existing.length === 0) throw new AppError('Listing not found', 404);
  if (existing[0].owner_id.toString() !== ownerId.toString()) throw new AppError('Forbidden', 403);

  await pool.query(
    'UPDATE Listings SET title = ?, description = ?, location = ?, monthly_rent = ? WHERE id = ?',
    [title, description, location, rent, id]
  );
  
  const [updated] = await pool.query('SELECT * FROM Listings WHERE id = ?', [id]);
  return updated[0];
};

const markAsFilled = async (id, ownerId) => {
  const pool = getPool();
  
  const [existing] = await pool.query('SELECT owner_id, is_filled FROM Listings WHERE id = ?', [id]);
  if (existing.length === 0) throw new AppError('Listing not found', 404);
  if (existing[0].owner_id.toString() !== ownerId.toString()) throw new AppError('Forbidden', 403);
  if (existing[0].is_filled) throw new AppError('Listing is already marked as filled', 400);

  await pool.query('UPDATE Listings SET is_filled = TRUE WHERE id = ?', [id]);
  
  // Note: CompatibilityScores need to be handled. Assuming a CompatibilityScores table exists or will exist
  // await pool.query('DELETE FROM CompatibilityScores WHERE listing_id = ?', [id]);

  const [updated] = await pool.query('SELECT * FROM Listings WHERE id = ?', [id]);
  return updated[0];
};

const deleteListing = async (id, ownerId) => {
  const pool = getPool();
  
  const [existing] = await pool.query('SELECT owner_id FROM Listings WHERE id = ?', [id]);
  if (existing.length === 0) throw new AppError('Listing not found', 404);
  if (existing[0].owner_id.toString() !== ownerId.toString()) throw new AppError('Forbidden', 403);

  await pool.query('DELETE FROM Listings WHERE id = ?', [id]);
};

const getOwnerListings = async (ownerId, queryParamsObj) => {
  const pool = getPool();
  const page = parseInt(queryParamsObj.page) || 1;
  const limit = parseInt(queryParamsObj.limit) || 10;
  const skip = (page - 1) * limit;

  const [listings] = await pool.query(
    'SELECT * FROM Listings WHERE owner_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [ownerId, limit, skip]
  );
    
  const [countResult] = await pool.query('SELECT COUNT(*) as totalCount FROM Listings WHERE owner_id = ?', [ownerId]);
  const totalCount = countResult[0].totalCount;
  
  return {
    listings,
    page,
    totalPages: Math.ceil(totalCount / limit),
    totalCount
  };
};

module.exports = { createListing, getListings, getOwnerListings, getListingById, updateListing, markAsFilled, deleteListing };
