const categoryRepository = require("../repositories/category.repository");

exports.getAllCategories = async () => {
  return await categoryRepository.findAll();
};

exports.getCategoryByType = async (categoryType) => {
  return await categoryRepository.findByType(categoryType);
};

exports.create = async (category) => {
  return await categoryRepository.create(category);
};

exports.getCategoryById = async (categoryId) => {
  return await categoryRepository.findById(categoryId);
};
