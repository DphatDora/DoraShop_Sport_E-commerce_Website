const productService = require("../services/product.service");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    if (products.length === 0) {
      return res.status(204).send();
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductsByCategoryId = async (req, res) => {
  try {
    const categoryId = req.query.categoryId;
    const products = await productService.getProductsByCategoryId(
      categoryId
    );
    if (products.length === 0) {
      return res.status(204).send();
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTopBestSellingProducts = async (req, res) => {
  try {
    const products = await productService.getTopBestSellingProducts();
    if (products.length === 0) {
      return res.status(204).send();
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTopLatestCreatedProducts = async (req, res) => {
  try {
    const products = await productService.getTopLatestCreatedProducts();
    if (products.length === 0) {
      return res.status(204).send();
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductByBrand = async (req, res) => {
  try {
    const brand = req.query.brand;
    const products = await productService.getProductsByBrand(brand);
    if (products.length === 0) {
      return res.status(204).send();
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.getProductByCategorySortByBestSelling = async (req, res) => {
  try {
    const categoryId = req.query.categoryId;
    const products = await productService.getProductByCategorySortByBestSelling(categoryId);
    if (products.length === 0) { 
        return res.status(204).send();
      }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.getProductByCategorySortByDayArrival = async (req, res) => {
  try {
    const categoryId = req.query.categoryId;
    const products = await productService.getProductByCategorySortByDayArrival(categoryId);
    if (products.length === 0) {
      return res.status(204).send();
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductByName = async (req, res) => {
  try {
    const name = req.query.name;
    const products = await productService.getProductByName(name);
    if (products.length === 0) {
      return res.status(204).send();
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.createProduct = async (req, res) => {
  try {
    const { name, price, categoryId, description, brand } = req.body;
    const product = await productService.createProduct(
      name,
      price,
      categoryId,
      description,
      brand
    );

    // Kiểm tra nếu có file ảnh
    if (req.file) {
      const uploadsDir = "src/uploads/product-img/";
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Lấy tên gốc của file nhưng đổi sang .jpg để nén tốt hơn
      const originalName = path.parse(req.file.originalname).name;
      const compressedFileName = `${originalName}_${Date.now()}.jpg`;
      const filePath = path.join(uploadsDir, compressedFileName);

      // Đường dẫn để lưu vào database (đường dẫn tương đối)
      const dbPath = `/uploads/product-img/${compressedFileName}`;

      // Nén ảnh bằng sharp
      await sharp(req.file.buffer)
        .resize({ width: 800 }) // Resize ảnh về chiều rộng tối đa 800px (tùy chỉnh)
        .jpeg({ quality: 80 }) // Chuyển sang JPEG với chất lượng 80%
        .toFile(filePath);

      // Cập nhật đường dẫn ảnh vào cơ sở dữ liệu
      const updatedProduct = await productService.updateProductImage(
        product.id,
        dbPath
      );
      return res.status(201).json(updatedProduct);
    }

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getRelatedProducts = async (req, res) => {
  try{
    const {categoryId, productId} = req.body;
    const relatedProducts = await productService.getRelatedProducts(categoryId, productId);
    if (relatedProducts.length === 0) {
      return res.status(204).send();
    }
    res.status(200).json(relatedProducts);
  
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

