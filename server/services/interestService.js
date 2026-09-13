const { getPool } = require('../config/db');
const AppError = require('../utils/AppError');
const emailService = require('./emailService');

const sendInterest = async (tenantId, listingId) => {
  const pool = getPool();
  const [profiles] = await pool.query('SELECT * FROM TenantProfiles WHERE user_id = ?', [tenantId]);
  if (profiles.length === 0) {
    throw new AppError('You must create a tenant profile before sending interest', 400);
  }

  const [listings] = await pool.query('SELECT * FROM Listings WHERE id = ?', [listingId]);
  if (listings.length === 0) {
    throw new AppError('Listing not found', 404);
  }
  const listing = listings[0];

  if (listing.owner_id.toString() === tenantId.toString()) {
    throw new AppError('You cannot express interest in your own listing', 400);
  }

  const [existingRequest] = await pool.query('SELECT * FROM InterestRequests WHERE sender_id = ? AND listing_id = ?', [tenantId, listingId]);
  if (existingRequest.length > 0) {
    throw new AppError('Interest request already sent for this listing', 409);
  }

  const [result] = await pool.query(
    'INSERT INTO InterestRequests (sender_id, listing_id, status) VALUES (?, ?, ?)',
    [tenantId, listingId, 'pending']
  );

  const [newRequestArray] = await pool.query('SELECT * FROM InterestRequests WHERE id = ?', [result.insertId]);
  const newRequest = newRequestArray[0];

  // Note: Compatibility logic is skipped or would query a CompatibilityScores table
  // Assuming a similar table structure or skipping for now.

  return newRequest;
};

const getReceivedInterests = async (ownerId, page = 1, limit = 10) => {
  const pool = getPool();
  const skip = (page - 1) * limit;

  // We need to join InterestRequests, Users (tenant), and Listings
  const query = `
    SELECT ir.*, 
           u.name as tenant_name, u.email as tenant_email,
           l.location as listing_location, l.monthly_rent as listing_rent
    FROM InterestRequests ir
    JOIN Listings l ON ir.listing_id = l.id
    JOIN Users u ON ir.sender_id = u.id
    WHERE l.owner_id = ?
    ORDER BY ir.created_at DESC
    LIMIT ? OFFSET ?
  `;

  const [rows] = await pool.query(query, [ownerId, Number(limit), Number(skip)]);
  
  // Format the output to roughly match the old structure
  const interests = rows.map(row => ({
    _id: row.id,
    id: row.id,
    status: row.status,
    tenant: { name: row.tenant_name, email: row.tenant_email },
    listing: { location: row.listing_location, rent: row.listing_rent },
    createdAt: row.created_at
  }));

  const [countResult] = await pool.query(
    'SELECT COUNT(*) as totalCount FROM InterestRequests ir JOIN Listings l ON ir.listing_id = l.id WHERE l.owner_id = ?', 
    [ownerId]
  );
  const totalCount = countResult[0].totalCount;

  return {
    interests,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: parseInt(page, 10)
  };
};

const getSentInterests = async (tenantId, page = 1, limit = 10) => {
  const pool = getPool();
  const skip = (page - 1) * limit;

  const query = `
    SELECT ir.*, 
           l.location as listing_location, l.monthly_rent as listing_rent,
           u.name as owner_name
    FROM InterestRequests ir
    JOIN Listings l ON ir.listing_id = l.id
    JOIN Users u ON l.owner_id = u.id
    WHERE ir.sender_id = ?
    ORDER BY ir.created_at DESC
    LIMIT ? OFFSET ?
  `;

  const [rows] = await pool.query(query, [tenantId, Number(limit), Number(skip)]);
  
  const interests = rows.map(row => ({
    _id: row.id,
    id: row.id,
    status: row.status,
    listing: { _id: row.listing_id, location: row.listing_location, rent: row.listing_rent },
    owner: { name: row.owner_name },
    createdAt: row.created_at,
    compatibilityScore: null // Add fetching from scores table if needed
  }));

  const [countResult] = await pool.query('SELECT COUNT(*) as totalCount FROM InterestRequests WHERE sender_id = ?', [tenantId]);
  const totalCount = countResult[0].totalCount;

  return {
    interests,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: parseInt(page, 10)
  };
};

const acceptInterest = async (interestId, ownerId) => {
  const pool = getPool();
  const [requests] = await pool.query(
    `SELECT ir.*, l.owner_id, l.location, u.name as tenant_name, u.email as tenant_email
     FROM InterestRequests ir 
     JOIN Listings l ON ir.listing_id = l.id 
     JOIN Users u ON ir.sender_id = u.id
     WHERE ir.id = ?`, 
    [interestId]
  );

  if (requests.length === 0) throw new AppError('Interest request not found', 404);
  const interest = requests[0];

  if (interest.owner_id.toString() !== ownerId.toString()) {
    throw new AppError('You are not authorized to accept this request', 403);
  }
  if (interest.status === 'accepted') throw new AppError('Interest request is already accepted', 400);
  if (interest.status === 'declined') throw new AppError('Cannot accept a declined request', 400);

  await pool.query('UPDATE InterestRequests SET status = ? WHERE id = ?', ['accepted', interestId]);

  // Try fetching owner name for email
  const [owners] = await pool.query('SELECT name FROM Users WHERE id = ?', [ownerId]);
  const ownerName = owners[0] ? owners[0].name : 'Landlord';

  emailService.sendAcceptedNotification(
    { name: interest.tenant_name, email: interest.tenant_email }, 
    { location: interest.location }, 
    interestId, 
    ownerName
  ).catch(err => console.error('Failed to send email:', err));

  return { id: interestId, status: 'accepted' };
};

const declineInterest = async (interestId, ownerId) => {
  const pool = getPool();
  const [requests] = await pool.query(
    `SELECT ir.*, l.owner_id, l.location, u.name as tenant_name, u.email as tenant_email
     FROM InterestRequests ir 
     JOIN Listings l ON ir.listing_id = l.id 
     JOIN Users u ON ir.sender_id = u.id
     WHERE ir.id = ?`, 
    [interestId]
  );

  if (requests.length === 0) throw new AppError('Interest request not found', 404);
  const interest = requests[0];

  if (interest.owner_id.toString() !== ownerId.toString()) {
    throw new AppError('You are not authorized to decline this request', 403);
  }
  if (interest.status === 'declined') throw new AppError('Interest request is already declined', 400);

  await pool.query('UPDATE InterestRequests SET status = ? WHERE id = ?', ['declined', interestId]);

  emailService.sendDeclinedNotification(
    { name: interest.tenant_name, email: interest.tenant_email }, 
    { location: interest.location }
  ).catch(err => console.error('Failed to send email:', err));

  return { id: interestId, status: 'declined' };
};

module.exports = { sendInterest, getReceivedInterests, getSentInterests, acceptInterest, declineInterest };
