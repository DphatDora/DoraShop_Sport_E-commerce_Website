const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Product = sequelize.define("Product", {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    brand: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DOUBLE, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
    soldQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    img: { type: DataTypes.STRING, allowNull: true },
  });

  const ProductImage = sequelize.define("ProductImage", {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    imgUrl: { type: DataTypes.STRING, allowNull: false },
  });

  Product.associate = (models) => {
    Product.belongsTo(models.Category, {
      foreignKey: "categoryId",
      as: "category",
    });
    Product.belongsToMany(models.Cart, {
      through: "Cart_Product", // Tên bảng trung gian
      foreignKey: "productId",
      otherKey: "cartId",
      as: "carts",
    });
    Product.hasMany(models.ProductImage, {
      foreignKey: "productId",
      as: "images",
      onDelete: "CASCADE",
    });
  };

  return Product;
};
