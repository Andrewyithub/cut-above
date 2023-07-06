const refreshTokenRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

refreshTokenRouter.get('/', async (req, res) => {
  console.log('refreshing');
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    console.log('no refresh token');
    return res.sendStatus(401);
  }
  const refreshToken = cookies.jwt;
  console.log('old refresh token', refreshToken.slice(-9));
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

  const foundUser = await User.findOne({ refreshToken }).exec();

  // Detected refresh token reuse!
  // Token has already been deleted from previous log out
  if (!foundUser) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        console.log('detected refresh token reuse');
        if (err) return res.sendStatus(403); //Forbidden
        // Delete refresh tokens of hacked user
        const hackedUser = await User.findOne({
          _id: decoded._id,
        }).exec();
        hackedUser.refreshToken = [];
        await hackedUser.save();
      }
    );
    console.log('detected refresh token reuse');
    return res.sendStatus(403); //Forbidden
  }

  const newRefreshTokenArray = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );

  // evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        // remove expired refresh token from user db
        console.log('refresh token expired');
        foundUser.refreshToken = [...newRefreshTokenArray];
        await foundUser.save();
      }
      if (err || foundUser._id.toString() !== decoded.id)
        return res.sendStatus(403);

      // Refresh token was still valid
      console.log('refresh token still valid');
      const accessToken = jwt.sign(
        {
          id: foundUser._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' }
      );

      const newRefreshToken = jwt.sign(
        { id: foundUser._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
      );
      // Saving refreshToken with current user
      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      await foundUser.save();

      // Creates Secure Cookie with refresh token
      res.cookie('jwt', newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 1 * 60 * 60 * 1000, // 1 day
      });
      console.log('newRefreshToken on refresh', newRefreshToken.slice(-9));
      res.json({ token: accessToken });
    }
  );
});

module.exports = refreshTokenRouter;
