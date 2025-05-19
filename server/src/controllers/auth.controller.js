const authService = require("../services/auth.service");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

exports.register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ message: "User registered", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { token, user } = await authService.login(req.body);
    res.json({ message: "Logged in", token, user });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const message = await authService.forgotPassword(req.body.email);
    res.json({ message });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ message: "Token and new password are required" });
  }

  try {
    const message = await authService.resetPassword(token, newPassword);
    res.json({ message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await authService.getProfile(req.userId);
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const updateData = req.body;
    var dbPath = null; // Đường dẫn ảnh đại diện

    // Kiểm tra nếu có file ảnh
    if (req.file) {
      const uploadsDir = "src/uploads/user-avatar/";
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Lấy tên gốc của file nhưng đổi sang .jpg để nén tốt hơn
      const originalName = path.parse(req.file.originalname).name;
      const compressedFileName = `${originalName}_${Date.now()}.jpg`;
      const filePath = path.join(uploadsDir, compressedFileName);

      // Đường dẫn để lưu vào database (đường dẫn tương đối)
      dbPath = `/uploads/user-avatar/${compressedFileName}`;

      // Nén ảnh bằng sharp
      await sharp(req.file.buffer)
        .resize({ width: 800 }) // Resize ảnh về chiều rộng tối đa 800px (tùy chỉnh)
        .jpeg({ quality: 80 }) // Chuyển sang JPEG với chất lượng 80%
        .toFile(filePath);
    }
    // Cập nhật đường dẫn ảnh vào cơ sở dữ liệu
    const updatedUser = await authService.updateUserProfile(
      userId,
      updateData,
      dbPath
    );

    return res.status(201).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const message = await authService.deleteUser(req.params.id);
    res.json({ message });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
