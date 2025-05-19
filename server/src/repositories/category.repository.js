const db = require("../models");
const Category = db.Category;

exports.findAll = async () => {
  return await Category.findAll();
};

exports.findByType = async (categoryType) => {
  return await Category.findOne({ where: { type: categoryType } });
};

exports.create = async (category) => {
  return await Category.create(category);
};

exports.findById = async (categoryId) => {
  return await Category.findByPk(categoryId);
};
