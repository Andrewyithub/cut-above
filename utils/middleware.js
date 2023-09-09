const logger = require('./logger');
const jwt = require('jsonwebtoken');
const AppError = require('./AppError');

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
    // return res.sendStatus(401);
    throw new AppError(401, 'Unauthorized');
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      // return res.sendStatus(403); //invalid token
      next(err);
    }
    req.user = decoded.id;
    next();
  });
};

const errorHandler = async (err, req, res, next) => {
  logger.error(err.name);
  logger.error(err.message);
  // Check if there is an active session
  if (req.session) {
    // Abort any open transactions
    await req.session.abortTransaction();
    // End the session
    req.session.endSession();
  }
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'invalid token',
    });
  } else if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'token expired',
    });
  } else if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  return res.status(500).json({ error: err.message });
};

module.exports = { errorHandler, requestLogger, verifyJWT };
