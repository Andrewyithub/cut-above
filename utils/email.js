'use strict';
const nodemailer = require('nodemailer');
const config = require('../config/config');

const sendEmail = async ({ receiver, employee, date, time }) => {
  const transporter = nodemailer.createTransport({
    service: config.EMAIL_SERVICE,
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASSWORD,
    },
  });

  const options = {
    from: config.EMAIL_USER,
    to: `${receiver}`,
    subject: `Your Reservation at Cut Above`, // Subject line
    text: `Thank for making a reservation. You are confirmed for an appointment on ${date} at ${time} with ${employee}.`, // plain text body
    html: `<div>Thank for making a reservation. You are confirmed for an appointment on ${date} at ${time} with ${employee}.</div>`, // html body
  };

  // Send Email
  transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log({ err });
    } else {
      console.log({ info });
    }
  });
};

module.exports = sendEmail;
