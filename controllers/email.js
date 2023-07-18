const sendEmail = require('../utils/email');
const config = require('../config/config');

const sendConfirmation = async () => {
  const emailSent = await sendEmail({
    receiver: 'andy.yu617@gmail.com',
    employee: 'employee',
    date: 'date',
    time: 'time',
  });
  console.log('email response: ', emailSent);
};

sendConfirmation();
