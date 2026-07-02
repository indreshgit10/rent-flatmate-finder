const { sendEmail } = require('../emails/mailer');
const highCompatibilityInterestTemplate = require('../emails/templates/highCompatibilityInterest');

const sendAcceptedNotification = async (tenant, listing) => {
  console.log(`[Email Mock] Sent accepted notification to ${tenant.email} for ${listing.location}`);
};

const sendDeclinedNotification = async (tenant, listing) => {
  console.log(`[Email Mock] Sent declined notification to ${tenant.email} for ${listing.location}`);
};

const sendHighCompatibilityAlert = async (owner, tenant, listing, score, explanation) => {
  const html = highCompatibilityInterestTemplate(tenant.name, listing.location, score, explanation);
  
  await sendEmail({
    to: owner.email,
    subject: `High Compatibility Alert: ${tenant.name} is interested in your listing!`,
    html
  });
};

module.exports = {
  sendAcceptedNotification,
  sendDeclinedNotification,
  sendHighCompatibilityAlert
};
