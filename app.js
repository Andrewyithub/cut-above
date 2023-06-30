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
const authRouter = require('./controllers/auth');
const logoutRouter = require('./controllers/logout');
const registerRouter = require('./controllers/register');
const appointmentRouter = require('./controllers/appointment');

logger.info('connecting to', process.env.MONGODB_URI);
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
app.use('/auth', authRouter);
app.use('/logout', logoutRouter);
app.use('/signup', registerRouter);
app.use(middleware.verifyJWT);
app.use('/appointment', appointmentRouter);

module.exports = app;
