const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

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

const validateToken = async (req, res) => {
  console.log('====================================');
  console.log('token validating');
  console.log('====================================');
  const { token } = req.params;
  console.log('====================================');
  console.log(token);
  console.log('====================================');
  jwt.verify(token, process.env.RESET_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Token is valid; you can access the payload (decoded) if needed
    console.log('====================================');
    console.log('decoded: ', decoded);
    console.log('====================================');
    res.status(200).json({ message: 'Token is valid' });
  });
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  // verify token
  jwt.verify(token, process.env.RESET_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Token is valid; update the password for the user associated with the token
    // You should implement your password update logic here

    const emailToken = decoded.id;
    const user = await User.findOne({ emailToken });
    console.log('====================================');
    console.log('user found', user);
    console.log('====================================');
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);
    user.passwordHash = passwordHash;
    const newEmailTokenArr = user.emailToken.filter((e) => e !== emailToken);
    user.emailToken = newEmailTokenArr;
    await user.save();
    res.status(200).json({ message: 'Password reset successful' });
  });
};

module.exports = {
  getAllUsers,
  changeEmail,
  changePassword,
  removeUserData,
  validateToken,
  resetPassword,
};
