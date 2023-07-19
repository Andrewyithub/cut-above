const sendEmail = require('../utils/email');
const User = require('../models/User');

const handleConfirmation = async (req, res) => {
  console.log('req received', req.body);
  const { employee, date, time } = req.body;
  const user = await User.findOne({ _id: req.user });
  const bookedEmployee = await User.findOne({ _id: employee });
  const emailSent = await sendEmail({
    receiver: user.email,
    employee: bookedEmployee.firstName,
    date,
    time,
    option: 'confirmation',
  });
  console.log('confirmation email response: ', emailSent);
  res.status(200).json({ success: true, message: 'Confirmation email sent' });
};

const handleModification = async (req, res) => {
  console.log('req received', req.body);
  const { employee, date, time } = req.body;
  const user = await User.findOne({ _id: req.user });
  const bookedEmployee = await User.findOne({ _id: employee });
  const emailSent = await sendEmail({
    receiver: user.email,
    employee: bookedEmployee.firstName,
    date,
    time,
    option: 'modification',
  });
  console.log('modification email response: ', emailSent);
  res.status(200).json({ success: true, message: 'Modification email sent' });
};

const handleCancellation = async (req, res) => {
  console.log('req received', req.body);
  const { employee, date, time } = req.body;
  const user = await User.findOne({ _id: req.user });
  const cancelledEmployee = await User.findOne({ _id: employee });
  const emailSent = await sendEmail({
    receiver: user.email,
    employee: cancelledEmployee.firstName,
    date,
    time,
    option: 'cancellation',
  });
  console.log('cancellation email response: ', emailSent);
  res.status(200).json({ success: true, message: 'Cancellation email sent' });
};

module.exports = {
  handleConfirmation,
  handleModification,
  handleCancellation,
};
