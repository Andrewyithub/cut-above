const logger = require('./logger');
const jwt = require('jsonwebtoken');

const requestLogger = (req, res, next) => {
  // prevents logging of user information
  if (req.path !== '/login') {
    logger.info('Method:', req.method);
    logger.info('Path:  ', req.path);
    logger.info('Body:  ', req.body);
    logger.info('---');
  }
  next();
};

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    console.log('failing with no token');
    return res.sendStatus(401);
  }
  const token = authHeader.split(' ')[1];
  if (token) console.log('token found');
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log('token has expired');
      return res.sendStatus(403); //invalid token
    }
    console.log('decoded: ', decoded);
    req.user = decoded.id;
    next();
  });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.name);
  logger.error(error.message);
  response.status(500).send(error.message);
  next(error);
};

module.exports = { errorHandler, requestLogger, verifyJWT };
