const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const sendgridAPIkey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(sendgridAPIkey);

const sendOTP = (email, otp) => {
  sgMail.send({
    to: email,
    from: process.env.SENDEREMAIL,
    subject: `Email Subject`,
    text: `Your one time password is - ${otp}.`,
  });
};


module.exports = {
  sendOTP,
};
