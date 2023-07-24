require('dotenv').config();
const express = require('express');
require('express-async-errors');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const corsOptions = require('./config/corsOptions');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');

mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', require('./routes/auth'));
app.use('/employee', require('./routes/employee'));
app.use('/logout', require('./routes/logout'));
app.use('/refresh', require('./routes/refreshToken'));
app.use('/signup', require('./routes/register'));
app.use('/schedule', require('./routes/schedule'));
app.use(middleware.verifyJWT);
app.use('/appointment', require('./routes/appointment'));
app.use('/email', require('./routes/email'));
app.use('/user', require('./routes/user'));

module.exports = app;
