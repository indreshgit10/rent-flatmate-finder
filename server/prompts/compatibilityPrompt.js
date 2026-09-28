const buildCompatibilityPrompt = (listing, tenantProfile) => {
  return `You are an AI assistant designed to evaluate the compatibility between a tenant and a room listing for a rent and flatmate finding platform.

Given the following room listing details and tenant profile, compute a compatibility score from 0 to 100.

6. Consider the following factors:
1. Budget match: Does the tenant's budget range cover the listing's rent?
2. Location match: Is the listing's location close to or exactly what the tenant prefers? (Case-insensitive)
3. Move-in date: Can the tenant move in on or after the listing's available date?
4. Lifestyle compatibility: Compare their sleep schedules, smoking/drinking habits, pet policies, and cleanliness expectations. Give this significant weight.
5. Room type and Furnishing: Does the listing match standard preferences?

Listing:
- Location: ${listing.location}
- Rent: $${listing.rent}/month
- Available From: ${listing.availableFrom ? new Date(listing.availableFrom).toISOString().split('T')[0] : 'N/A'}
- Room Type: ${listing.room_type || listing.roomType || 'N/A'}
- Furnishing: ${listing.furnishing || 'N/A'}
- Sleep Schedule: ${listing.sleep_schedule || listing.sleepSchedule || 'N/A'}
- Smoking Habit: ${listing.smoking_habit || listing.smokingHabit || 'N/A'}
- Drinking Habit: ${listing.drinking_habit || listing.drinkingHabit || 'N/A'}
- Pet Policy: ${listing.pet_policy || listing.petPolicy || 'N/A'}
- Cleanliness: ${listing.cleanliness || 'N/A'}

Tenant Profile:
- Preferred Location: ${tenantProfile.preferred_location || tenantProfile.preferredLocation}
- Budget Range: $${tenantProfile.budget_min || tenantProfile.budgetMin} - $${tenantProfile.budget_max || tenantProfile.budgetMax}/month
- Move-in Date: ${tenantProfile.move_in_date || tenantProfile.moveInDate ? new Date(tenantProfile.move_in_date || tenantProfile.moveInDate).toISOString().split('T')[0] : 'N/A'}
- Sleep Schedule: ${tenantProfile.sleep_schedule || tenantProfile.sleepSchedule || 'N/A'}
- Smoking Habit: ${tenantProfile.smoking_habit || tenantProfile.smokingHabit || 'N/A'}
- Drinking Habit: ${tenantProfile.drinking_habit || tenantProfile.drinkingHabit || 'N/A'}
- Pet Policy: ${tenantProfile.pet_policy || tenantProfile.petPolicy || 'N/A'}
- Cleanliness: ${tenantProfile.cleanliness || 'N/A'}
- Room Type: ${tenantProfile.room_type || tenantProfile.roomType || 'N/A'}
- Furnishing: ${tenantProfile.furnishing || 'N/A'}

Return ONLY a valid JSON object in the exact format below, with no markdown formatting or extra text.
{
  "score": <number 0-100>,
  "explanation": "<one to two sentences explaining the score>"
}`;
};

module.exports = { buildCompatibilityPrompt };
