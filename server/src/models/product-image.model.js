const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const ProductImage = sequelize.define("ProductImage", {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      imgUrl: { type: DataTypes.STRING, allowNull: false },
    });

    ProductImage.associate = (models) => {
      ProductImage.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
        onDelete: "CASCADE",
      });
    }
    return ProductImage;    
}