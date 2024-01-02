const jwt = require('jsonwebtoken');
const AppError = require('./AppError');

const createAccessToken = (id) => {
  if (!process.env.EMAIL_TOKEN_SECRET) {
    throw new AppError(
      500,
      'ACCESS_TOKEN_SECRET not defined in the environment'
    );
  }
  try {
    const accessToken = jwt.sign(
      {
        id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    );
    return accessToken;
  } catch (err) {
    console.error(err);
    throw new AppError(500, 'Unable to create access token');
  }
};

// Creates a jwt token which is in a url sent to the user. The encoded value is an emailId stored inside user DB document.
const createEmailToken = (id, expiresIn) => {
  if (!process.env.EMAIL_TOKEN_SECRET) {
    throw new AppError(
      500,
      'REFRESH_TOKEN_SECRET not defined in the environment'
    );
  }
  try {
    const userEmailToken = jwt.sign(
      {
        id,
      },
      process.env.EMAIL_TOKEN_SECRET,
      { expiresIn }
    );
    return userEmailToken;
  } catch (err) {
    console.error(err);
    throw new AppError(500, 'Unable to create email token');
  }
};

const createRefreshToken = (id) => {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new AppError(
      500,
      'REFRESH_TOKEN_SECRET not defined in the environment'
    );
  }
  try {
    const refreshToken = jwt.sign(
      {
        id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );
    return refreshToken;
  } catch (err) {
    console.error(err);
    throw new AppError(500, 'Unable to create refresh token');
  }
};

module.exports = {
  createAccessToken,
  createEmailToken,
  createRefreshToken,
};
