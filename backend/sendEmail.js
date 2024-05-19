// sendEmail.js
const transporter = require('./emailConfig');

const sendEmail = async (to, subject, text) => {
  const mailOptions = { 
    from: 'bokhariiqra@gmail.com',
    to,
    subject,
    text
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
