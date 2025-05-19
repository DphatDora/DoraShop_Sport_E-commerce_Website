const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const verifyToken = require("../middlewares/auth.middleware");

router.post("/create", verifyToken, orderController.createOrder);
router.get("/status", verifyToken, orderController.getOrderByStatus);
router.put("/update-order", verifyToken, orderController.updateOrderStatus);

module.exports = router;
