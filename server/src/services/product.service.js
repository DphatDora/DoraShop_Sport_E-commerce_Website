const productRepository = require("../repositories/product.repository");
const categoryRepository = require("../repositories/category.repository");

exports.getAllProducts = async () => {
  return await productRepository.findAll();
}

exports.getProductsByCategoryId = async (categoryId) => {
  return await productRepository.findByCategoryId(categoryId);
};

exports.getTopBestSellingProducts = async () => {
  return await productRepository.findTopBestSellingProducts();
};

exports.getTopLatestCreatedProducts = async () => {
  return await productRepository.findTopLatestCreatedProducts();
};

exports.getProductsByBrand = async (brand) => {
  return await productRepository.findByBrand(brand);
};

exports.getProductByName = async (name) => {
  return await productRepository.findByName(name);
};

exports.getProductByCategorySortByBestSelling = async (categoryId) => {
    return await productRepository.findByCategorySortByBestSelling(categoryId);
}

exports.getProductByCategorySortByDayArrival = async (categoryId) => {
  return await productRepository.findByCategorySortByDayArrival(categoryId);
};

exports.createProduct = async (name, price, categoryId, description, brand) => {
  const category = await categoryRepository.findById(categoryId);
  if (!category) {
    throw new Error("Category không tồn tại");
  }
  const product = {
    name,
    price,
    soldQuantity: 0,
    description: description,
    brand: brand,
    categoryId: category.id,
  };
  return await productRepository.create(product);
};

exports.updateProductImage = async (productId, imgPath) => {
  return await productRepository.updateImage(productId, imgPath);
};

exports.getRelatedProducts = async (categoryId, productId) => {
  return await productRepository.findRelatedProducts(categoryId, productId);
}