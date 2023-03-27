const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const sendgridAPIkey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(sendgridAPIkey);

const sendOTP = (email, otp) => {
  sgMail.send({
    to: email,
    from: "ujjwal@makemybrain.com",
    subject: `Ujjwal From MakeMyBrain | OTP`,
    text: `Your one time password is - ${otp}.`,
  });
};

// sendOTP("binaybhattacharya558@gmail.com", "Ujjwal");

module.exports = {
  sendOTP,
};
