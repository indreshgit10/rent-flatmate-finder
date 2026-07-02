const interestAccepted = (tenantName, location, ownerName, chatLink) => {
  return `
    <div style="font-family: Arial, sans-serif; max-w-2xl; margin: 0 auto; padding: 20px;">
      <h2 style="color: #10b981;">Interest Request Accepted!</h2>
      <p>Hello ${tenantName},</p>
      <p>Great news! ${ownerName} has accepted your interest request for the listing at <strong>${location}</strong>.</p>
      
      <p>You can now chat directly with the owner to discuss the next steps.</p>

      <p style="margin: 30px 0;">
        <a href="${chatLink}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Go to Chat
        </a>
      </p>
      
      <p>Best regards,<br/>The Rent & Flatmate Finder Team</p>
    </div>
  `;
};

module.exports = interestAccepted;
