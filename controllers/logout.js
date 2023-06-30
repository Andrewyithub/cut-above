const User = require('../models/User');
const logoutRouter = require('express').Router();

logoutRouter.get('/', async (req, res) => {
  // On client, also delete the accessToken

  const cookies = req.cookies;

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  res.sendStatus(204);
});

module.exports = logoutRouter;
