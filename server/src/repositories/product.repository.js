const e = require("cors");
const db = require("../models");
const Product = db.Product;
const { Op } = require("sequelize");

exports.create = async (product) => {
  return await Product.create(product);
};

exports.findByCategoryId = async (categoryId) => {
  return await Product.findAll({ where: { categoryId } });
};

// get all products
exports.findAll = async () => {
  return await Product.findAll();
};

exports.findTopBestSellingProducts = async () => {
  return await Product.findAll({
    order: [["soldQuantity", "DESC"]],
    limit: 4
  });
};

exports.findTopLatestCreatedProducts = async () => {
  return await Product.findAll({
    order: [["createdAt", "DESC"]],
    limit: 4
  });
};

exports.findByBrand = async (brand) => {
  return await Product.findAll({
    where: {
      brand: {
        [Op.like]: `%${brand}%`,
      },
    },
  });
};

exports.findByName = async (name) => {
  return await Product.findAll({
    where: {
      name: {
        [Op.like]: `%${name}%`,
      },
    },
  });
}

exports.findByCategorySortByBestSelling = async (categoryId) => {
  return await Product.findAll({
    where: { categoryId },
    order: [["soldQuantity", "DESC"]],
  });
};

exports.findByCategorySortByDayArrival = async (categoryId) => {
  return await Product.findAll({
    where: { categoryId },
    order: [["createdAt", "DESC"]],
  });
};

exports.updateImage = async (productId, imgPath) => {
  const product = await Product.findByPk(productId);
  if (!product) throw new Error("Product not found");

  product.img = imgPath;
  await product.save();
  return product;
};

exports.findRelatedProducts = async (categoryId, productId) => {
  return await Product.findAll({
    where: {
      categoryId,
      id: {
        [Op.ne]: productId,
      },
    },
    limit: 4,
  });
};