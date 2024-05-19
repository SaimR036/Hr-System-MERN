// emailConfig.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host:'smtp.gmail.com',
  port:'587',
  secure:false,
  auth: {
    user: 'bokhariiqra@gmail.com',
    pass: 'fqto nmul rgql etat'
  }
});

module.exports = transporter;
