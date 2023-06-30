const authRouter = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: 'Username and password are required.' });
  const foundUser = await User.findOne({ email }); // removed .exec();
  const match = await bcrypt.compare(password, foundUser.passwordHash);
  if (match) {
    const newRefreshToken = jwt.sign(
      {
        id: foundUser._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '10m' }
    );
    // Creates Secure Cookie with refresh token
    res.cookie('jwt', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ success: true, message: 'Successfully logged in' });
  } else {
    res.sendStatus(401);
  }
});

module.exports = authRouter;
