const sendEmail = require('../utils/email');
const User = require('../models/User');

const handleConfirmation = async (req, res) => {
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
  res.status(200).json({ success: true, message: 'Confirmation email sent' });
};

const handleModification = async (req, res) => {
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
  res.status(200).json({ success: true, message: 'Modification email sent' });
};

const handleCancellation = async (req, res) => {
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
  res.status(200).json({ success: true, message: 'Cancellation email sent' });
};

module.exports = {
  handleConfirmation,
  handleModification,
  handleCancellation,
};
