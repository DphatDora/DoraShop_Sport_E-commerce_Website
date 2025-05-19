const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const verifyToken = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.get("/profile", verifyToken, authController.getProfile);
router.delete("/delete/:id", verifyToken, authController.deleteUser);
router.put(
  "/update-profile",
  verifyToken,
  upload.single("avatar"),
  authController.updateProfile
);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
module.exports = router;
