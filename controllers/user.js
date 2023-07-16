const userRouter = require('express').Router();
const User = require('../models/User');

userRouter.get('/', async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

userRouter.delete('/', async (req, res) => {
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
});

module.exports = userRouter;
