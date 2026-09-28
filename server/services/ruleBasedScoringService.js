const computeRuleBasedScore = (listing, tenantProfile) => {
  let score = 0;
  const matches = [];

  // Budget Match (30%)
  if (listing.rent >= tenantProfile.budgetMin && listing.rent <= tenantProfile.budgetMax) {
    score += 30;
    matches.push('budget');
  } else if (listing.rent < tenantProfile.budgetMin) {
    score += 30;
    matches.push('budget');
  }

  // Location Match (20%)
  const listLoc = (listing.location || '').toLowerCase();
  const prefLoc = (tenantProfile.preferredLocation || tenantProfile.preferred_location || '').toLowerCase();
  if (listLoc && prefLoc && (listLoc.includes(prefLoc) || prefLoc.includes(listLoc))) {
    score += 20;
    matches.push('location');
  }

  // Move-in Date (10%)
  const moveInDateStr = tenantProfile.moveInDate || tenantProfile.move_in_date;
  const availableStr = listing.availableFrom || listing.available_from;
  if (moveInDateStr && availableStr) {
    const moveIn = new Date(moveInDateStr).getTime();
    const available = new Date(availableStr).getTime();
    if (moveIn >= available) {
      score += 10;
      matches.push('move-in date');
    }
  }

  // Lifestyle Factors (8% each = 40% total)
  
  const tpSleep = tenantProfile.sleep_schedule || tenantProfile.sleepSchedule;
  const lsSleep = listing.sleep_schedule || listing.sleepSchedule;
  if (tpSleep && lsSleep && tpSleep === lsSleep) {
    score += 8;
    matches.push('sleep schedule');
  } else if (!tpSleep || !lsSleep) { score += 4; }

  const tpSmoke = tenantProfile.smoking_habit || tenantProfile.smokingHabit;
  const lsSmoke = listing.smoking_habit || listing.smokingHabit;
  if (tpSmoke && lsSmoke && tpSmoke === lsSmoke) {
    score += 8;
    matches.push('smoking habit');
  } else if (!tpSmoke || !lsSmoke) { score += 4; }

  const tpDrink = tenantProfile.drinking_habit || tenantProfile.drinkingHabit;
  const lsDrink = listing.drinking_habit || listing.drinkingHabit;
  if (tpDrink && lsDrink && tpDrink === lsDrink) {
    score += 8;
    matches.push('drinking habit');
  } else if (!tpDrink || !lsDrink) { score += 4; }

  const tpPet = tenantProfile.pet_policy || tenantProfile.petPolicy;
  const lsPet = listing.pet_policy || listing.petPolicy;
  if (tpPet && lsPet && tpPet === lsPet) {
    score += 8;
    matches.push('pet policy');
  } else if (!tpPet || !lsPet) { score += 4; }

  const tpClean = tenantProfile.cleanliness;
  const lsClean = listing.cleanliness;
  if (tpClean && lsClean && tpClean === lsClean) {
    score += 8;
    matches.push('cleanliness');
  } else if (!tpClean || !lsClean) { score += 4; }

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
