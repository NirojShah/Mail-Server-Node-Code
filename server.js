const nodemailer = require('nodemailer');

// Create a SMTP transporter object
const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 25,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'admin@localserver.com',
    pass: 'test1234'
  }
});

// Email message options
const mailOptions = {
  from: 'admin@localserver.com',
  to: 'nirajshah@localserver.com',
  subject: 'Test Email with Attachment',
  text: 'This is a test email with an attachment sent using nodemailer.',
  html: '<p>This is a test email with an attachment sent using nodemailer.</p>',
  attachments: [
    {
      filename: 'attachment505.txt',
      content: 'This is the attachment content.'
    }
  ]
};

// Send email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error occurred:', error.message);
    return;
  }
  console.log('Email sent successfully!');
  console.log('Message ID:', info.messageId);
});
