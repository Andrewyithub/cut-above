const User = require('../models/User');

const getAllUsers = async () => {
  return await User.find();
};

const findById = async (id) => {
  return await User.findById(id).lean();
};

const create = async (userData) => {
  const newUser = new User(userData);
  await newUser.save();
  return newUser;
};

const changePassword = async (id, newPasswordHash) => {
  const user = await User.findById(id);
  user.passwordHash = newPasswordHash;
  await user.save();
  return user;
};

module.exports = {
  getAllUsers,
  findById,
  create,
  changePassword,
};
