const employeeRouter = require('express').Router();
const User = require('../models/User');

employeeRouter.get('/', async (req, res) => {
  const employees = await User.find({ role: 'employee' });
  res.status(200).json(employees);
});

module.exports = employeeRouter;
