const nodemailer = require('nodemailer');
const EmailError = require('../utils/EmailError');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify connection configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.warn('SMTP Connection warning: Nodemailer could not connect to SMTP server. Ensure EMAIL_USER and EMAIL_PASS are set correctly.');
  } else {
    console.log('SMTP Connection successful: Server is ready to take our messages');
  }
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: `"Rent & Flatmate Finder" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };
    
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new EmailError(`Failed to send email to ${to}: ${error.message}`);
  }
};

module.exports = { sendEmail };
