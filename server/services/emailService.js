const sendAcceptedNotification = async (tenant, listing) => {
  console.log(`[Email Mock] Sent accepted notification to ${tenant.email} for ${listing.location}`);
};

const sendDeclinedNotification = async (tenant, listing) => {
  console.log(`[Email Mock] Sent declined notification to ${tenant.email} for ${listing.location}`);
};

const sendHighCompatibilityAlert = async (owner, tenant, listing, score, explanation) => {
  console.log(`[Email Mock] Sent high compatibility alert to ${owner.email} for ${tenant.name}`);
};

module.exports = {
  sendAcceptedNotification,
  sendDeclinedNotification,
  sendHighCompatibilityAlert
};
