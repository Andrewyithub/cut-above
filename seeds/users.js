const bcrypt = require('bcrypt');
const User = require('../models/User');
const createClient = async () => {
  return await User.create(sampleUsers[0]);
};
const createEmployee = async () => {
  return await User.create(sampleUsers[1]);
};
const sampleUsers = [
  {
    firstName: 'John',
    lastName: 'Clark',
    email: 'John@cut_above_client.com',
    passwordHash: bcrypt.hashSync('password', 10),
    role: 'client',
  },
  {
    firstName: 'Jane',
    lastName: 'Emerson',
    email: 'Jane@cut_above_employee.com',
    passwordHash: bcrypt.hashSync('password', 10),
    role: 'employee',
  },
  {
    firstName: 'Frank',
    lastName: 'Esteban',
    email: 'Frank@cut_above_employee.com',
    passwordHash: bcrypt.hashSync('password', 10),
    role: 'employee',
  },
];

module.exports = { sampleUsers, createClient, createEmployee };
