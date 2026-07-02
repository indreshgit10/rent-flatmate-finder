const { sendEmail } = require('../emails/mailer');
const highCompatibilityInterestTemplate = require('../emails/templates/highCompatibilityInterest');
const interestAcceptedTemplate = require('../emails/templates/interestAccepted');
const interestDeclinedTemplate = require('../emails/templates/interestDeclined');

const sendAcceptedNotification = async (tenant, listing, interestId, ownerName) => {
  const chatLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/chat/${interestId}`;
  const html = interestAcceptedTemplate(tenant.name, listing.location, ownerName || 'The Owner', chatLink);
  
  await sendEmail({
    to: tenant.email,
    subject: `Interest Accepted: ${listing.location}`,
    html
  });
};

const sendDeclinedNotification = async (tenant, listing) => {
  const html = interestDeclinedTemplate(tenant.name, listing.location);
  
  await sendEmail({
    to: tenant.email,
    subject: `Update on your interest for ${listing.location}`,
    html
  });
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
