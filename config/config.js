require('dotenv').config();

const MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;
const CLIENT_URL =
  process.env.NODE_ENV === 'development'
    ? process.env.DEV_CLIENT_URL
    : process.env.PROD_CLIENT_URL;
const EMAIL_SERVICE =
  process.env.NODE_ENV === 'development'
    ? process.env.DEV_EMAIL_SERVICE
    : process.env.EMAIL_SERVICE;
const EMAIL_USER =
  process.env.NODE_ENV === 'development'
    ? process.env.DEV_EMAIL_USER
    : process.env.EMAIL_USER;
const EMAIL_PASSWORD =
  process.env.NODE_ENV === 'development'
    ? process.env.DEV_EMAIL_PASSWORD
    : process.env.EMAIL_PASSWORD;
const PORT =
  process.env.NODE_ENV === 'development'
    ? process.env.DEV_PORT
    : process.env.PORT;

module.exports = {
  MONGODB_URI,
  CLIENT_URL,
  EMAIL_SERVICE,
  EMAIL_USER,
  EMAIL_PASSWORD,
  PORT,
};
