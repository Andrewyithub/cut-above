const User = require('../models/User');

const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
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

module.exports = { getAllUsers, removeUserData };
