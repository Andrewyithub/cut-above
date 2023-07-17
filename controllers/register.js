const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const handleRegister = async (request, response) => {
  const { firstName, lastName, email, password } = request.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return response.status(400).json({ error: 'Email must be unique' });
  }
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = new User({
    firstName,
    lastName,
    email,
    passwordHash,
  });

  await newUser.save();

  response
    .status(201)
    .send({ success: true, message: 'Successfully registered account' });
};

module.exports = { handleRegister };
