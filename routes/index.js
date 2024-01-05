const appointmentRoutes = require('./appointment');
const authRoutes = require('./auth');
const emailRoutes = require('./email');
const employeeRoutes = require('./employee');
const logoutRoutes = require('./logout');
const refreshRoutes = require('./refreshToken');
const registerRoutes = require('./register');
const scheduleRoutes = require('./schedule');
const userRoutes = require('./auth');

const defineRoutes = (app) => {
  app.use('/api/appointment', appointmentRoutes);
  app.use('/auth', authRoutes);
  app.use('/api/email', emailRoutes);
  app.use('/api/employee', employeeRoutes);
  app.use('/logout', logoutRoutes);
  app.use('/refresh', refreshRoutes);
  app.use('/signup', registerRoutes);
  app.use('/api/schedule', scheduleRoutes);
  app.use('/api/user', userRoutes);
};

module.exports = { defineRoutes };
