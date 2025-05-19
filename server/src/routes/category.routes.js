const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");

router.get("/list", categoryController.getAllCategory);
router.post("/add", categoryController.addCategory);

module.exports = router;
