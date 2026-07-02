const highCompatibilityInterest = (tenantName, location, score, explanation) => {
  return `
    <div style="font-family: Arial, sans-serif; max-w-2xl; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2563eb;">High Compatibility Alert!</h2>
      <p>Hello,</p>
      <p>Great news! A tenant with a high compatibility score has just expressed interest in your listing at <strong>${location}</strong>.</p>
      
      <div style="background-color: #f8fafc; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Tenant: ${tenantName}</h3>
        <p style="font-size: 1.2rem; color: #10b981; margin: 10px 0;"><strong>Compatibility Score: ${score}%</strong></p>
        <p style="color: #475569; font-style: italic;">"${explanation}"</p>
      </div>

      <p>Check out your <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard/owner/interests" style="color: #2563eb; text-decoration: underline;">Dashboard</a> to review this request and connect with them.</p>
      
      <p>Best regards,<br/>The Rent & Flatmate Finder Team</p>
    </div>
  `;
};

module.exports = highCompatibilityInterest;
