const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const upload = require("../middlewares/upload.middleware");

router.get("/list", productController.getAllProducts);
router.get("/list-category", productController.getProductsByCategoryId);
router.get("/best-selling", productController.getTopBestSellingProducts);
router.get("/list-brand", productController.getProductByBrand);
router.get("/latest-created", productController.getTopLatestCreatedProducts);
router.post("/add", upload.single("img"), productController.createProduct);
router.get("/search", productController.getProductByName);
router.get("/best-selling-category", productController.getProductByCategorySortByBestSelling);
router.get("/day-arrival-category", productController.getProductByCategorySortByDayArrival);
router.post("/related-products", productController.getRelatedProducts);

module.exports = router;
