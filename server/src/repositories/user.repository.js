const db = require("../models");
const User = db.User;
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

exports.createUser = async (userData) => {
  return await User.create(userData);
};

exports.findUserByUsername = async (username) => {
  return await User.findOne({ where: { username } });
};

exports.findUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

exports.findUserById = async (userId) => {
  return await User.findByPk(userId);
};

// exports.updateUser = async (userId, updateData) => {
//   const user = await User.findByPk(userId);
//   if (!user) throw new Error("User not found");

//   Object.assign(user, updateData);
//   await user.save();
//   return user;
// };

exports.updateUser = async (userId, updateData, avatarPath) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  // Cập nhật thông tin người dùng
  Object.assign(user, updateData);
  user.avatar = avatarPath || user.avatar; // Cập nhật đường dẫn ảnh đại diện nếu có
  await user.save();
  return user;
};

exports.deleteUser = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  await user.destroy();
  return "User deleted successfully";
};
