const computeRuleBasedScore = (listing, tenantProfile) => {
  let score = 0;
  const matches = [];

  // Budget Match (40%)
  if (listing.rent >= tenantProfile.budgetMin && listing.rent <= tenantProfile.budgetMax) {
    score += 40;
    matches.push('budget');
  } else if (listing.rent < tenantProfile.budgetMin) {
    score += 40;
    matches.push('budget');
  }

  // Location Match (30%)
  const listLoc = listing.location.toLowerCase();
  const prefLoc = tenantProfile.preferredLocation.toLowerCase();
  if (listLoc.includes(prefLoc) || prefLoc.includes(listLoc)) {
    score += 30;
    matches.push('location');
  }

  // Move-in Date (15%)
  const moveIn = new Date(tenantProfile.moveInDate).getTime();
  const available = new Date(listing.availableFrom).getTime();
  if (moveIn >= available) {
    score += 15;
    matches.push('move-in date');
  }

  // Room Type (10%)
  if (tenantProfile.roomType) {
    if (tenantProfile.roomType === listing.roomType) {
      score += 10;
      matches.push('room type');
    }
  } else {
    score += 10;
  }

  // Furnishing (5%)
  if (tenantProfile.furnishing) {
    if (tenantProfile.furnishing === listing.furnishing) {
      score += 5;
      matches.push('furnishing');
    }
  } else {
    score += 5;
  }

  let explanation = `Rule-based match (${score}%). `;
  if (matches.length > 0) {
    explanation += `Matches well on: ${matches.join(', ')}.`;
  } else {
    explanation += `Few exact matches found based on strict rules.`;
  }

  return {
    score,
    explanation,
    source: 'rule-based'
  };
};

module.exports = { computeRuleBasedScore };
