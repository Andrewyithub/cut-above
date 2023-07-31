const bcrypt = require('bcrypt');
const User = require('../models/User');

const handleRegister = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'Email must be unique' });
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

  res
    .status(201)
    .send({ success: true, message: 'Successfully registered account' });
};

module.exports = { handleRegister };
