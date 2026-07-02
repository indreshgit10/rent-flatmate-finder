const buildCompatibilityPrompt = (listing, tenantProfile) => {
  return `You are an AI assistant designed to evaluate the compatibility between a tenant and a room listing for a rent and flatmate finding platform.

Given the following room listing details and tenant profile, compute a compatibility score from 0 to 100.

Consider the following factors:
1. Budget match: Does the tenant's budget range cover the listing's rent?
2. Location match: Is the listing's location close to or exactly what the tenant prefers? (Case-insensitive)
3. Move-in date: Can the tenant move in on or after the listing's available date?
4. Room type: Does the listing's room type fit standard preferences?
5. Furnishing: Does the listing's furnishing state match typical expectations?

Listing:
- Location: ${listing.location}
- Rent: $${listing.rent}/month
- Available From: ${new Date(listing.availableFrom).toISOString().split('T')[0]}
- Room Type: ${listing.roomType}
- Furnishing: ${listing.furnishing}

Tenant Profile:
- Preferred Location: ${tenantProfile.preferredLocation}
- Budget Range: $${tenantProfile.budgetMin} - $${tenantProfile.budgetMax}/month
- Move-in Date: ${new Date(tenantProfile.moveInDate).toISOString().split('T')[0]}

Return ONLY a valid JSON object in the exact format below, with no markdown formatting or extra text.
{
  "score": <number 0-100>,
  "explanation": "<one to two sentences explaining the score>"
}`;
};

module.exports = { buildCompatibilityPrompt };
