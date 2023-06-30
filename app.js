require('dotenv').config();
const express = require('express');
require('express-async-errors');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const corsOptions = require('./config/corsOptions');

const authRouter = require('./controllers/auth');
const registerRouter = require('./controllers/register');

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
app.use('/signup', registerRouter);
app.use('/auth', authRouter);

module.exports = app;
