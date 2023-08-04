const logger = require("./logger");
const jwt = require("jsonwebtoken");
const AppError = require("./AppError");

const requestLogger = (req, res, next) => {
  // prevents logging of user information
  if (req.path !== "/login") {
    logger.info("Method:", req.method);
    logger.info("Path:  ", req.path);
    logger.info("Body:  ", req.body);
    logger.info("---");
  }
  next();
};

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    console.log("no bearer");
    return res.sendStatus(401);
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(403); //invalid token
    }
    req.user = decoded.id;
    next();
  });
};

const errorHandler = (err, req, res, next) => {
  logger.error(err.name);
  logger.error(err.message);
  if (err instanceof AppError) {
    return res.sendStatus(err.statusCode).json({ error: err.message });
  }

  res.status(500).json({ error: err.message });
  next(err);
};

module.exports = { errorHandler, requestLogger, verifyJWT };
