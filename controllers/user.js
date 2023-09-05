const bcrypt = require('bcrypt');
const User = require('../models/User');

const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
};

const changeEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findById(req.user);
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'Email must be unique' });
  }
  user.email = email;
  await user.save();
  res.status(200).json({
    success: true,
    message: 'User email successfully changed',
    user: user.email,
  });
};

const changePassword = async (req, res) => {
  const { password } = req.body;
  const userId = req.user || req.params.id;
  const user = await User.findById(userId);
  console.log('====================================');
  console.log(user);
  console.log('====================================');
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  user.passwordHash = passwordHash;
  await user.save();
  res
    .status(200)
    .json({ success: true, message: 'User password successfully changed' });
};

const removeUserData = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user, {
    firstName: '[deleted]',
    lastName: '[deleted]',
    email: '[deleted]',
    passwordHash: '',
    schedule: '[deleted]',
    refreshToken: [],
  });
  await user.save();
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
  });
  res.status(200).json({
    success: true,
    message: 'User successfully deleted',
  });
};

module.exports = { getAllUsers, changeEmail, changePassword, removeUserData };
