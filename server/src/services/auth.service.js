const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/user.repository");
const { sendMail } = require("../config/mail.config"); 
const crypto = require("crypto");
const secret = process.env.SECRET_KEY;

// Đăng ký tài khoản
exports.register = async ({ username, email, phone, password, address }) => {
  const hashedPassword = await bcrypt.hash(password, 8);
  return await userRepository.createUser({
    username,
    email,
    phone,
    password: hashedPassword,
    address
  });
};

// Đăng nhập
exports.login = async ({ email, password }) => {
  const user = await userRepository.findUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid credentials");
  }
  const token = jwt.sign({ id: user.id, username: user.username }, secret, {
    expiresIn: "1h",
  });
  return { token, user };
};

// Lấy thông tin người dùng
exports.getProfile = async (userId) => {
  const user = await userRepository.findUserById(userId);
  if (!user) throw new Error("User not found");
  return user;
};

// Cập nhật thông tin người dùng
exports.updateUserProfile = async (userId, updateData, avatarPath) => {
  return await userRepository.updateUser(userId, updateData, avatarPath);
};

// Xóa người dùng
exports.deleteUser = async (userId) => {
  return await userRepository.deleteUser(userId);
};

// Quên mật khẩu
exports.forgotPassword = async (email) => {
  const user = await userRepository.findUserByEmail(email);
  if (!user) throw new Error("User not found");

  const resetToken = jwt.sign(
    { userId: user.id },
    secret,
    { expiresIn: "1h" }
  );

  // Tạo link reset password kèm token
  const resetLink = `http://localhost:4000/reset-password?token=${resetToken}`;

  // Gửi email
  await sendMail(
    user.email,
    "Reset Your Password",
    `<p>Click vào đường link sau để đặt lại mật khẩu: <a href="${resetLink}">Đặt lại mật khẩu</a></p>`
  );

  return "Password reset link sent to your email";
};

// Reset mật khẩu
exports.resetPassword = async (token, newPassword) => {
  try {
    const decoded = jwt.verify(token, secret);
    const userId = decoded.userId;

    const user = await userRepository.findUserById(userId);
    if (!user) throw new Error("User not found");

    // Update mật khẩu mới
    user.password = await bcrypt.hash(newPassword, 8);
    await user.save();

    return "Password has been reset successfully";
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};