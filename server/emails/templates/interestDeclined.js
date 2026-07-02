const interestDeclined = (tenantName, location) => {
  return `
    <div style="font-family: Arial, sans-serif; max-w-2xl; margin: 0 auto; padding: 20px;">
      <h2 style="color: #475569;">Update on your Interest Request</h2>
      <p>Hello ${tenantName},</p>
      <p>The owner of the listing at <strong>${location}</strong> has unfortunately declined your interest request.</p>
      
      <p>Don't worry! There are many other great listings available on our platform.</p>

      <p style="margin: 30px 0;">
        <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/listings" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Browse More Listings
        </a>
      </p>
      
      <p>Best regards,<br/>The Rent & Flatmate Finder Team</p>
    </div>
  `;
};

module.exports = interestDeclined;
