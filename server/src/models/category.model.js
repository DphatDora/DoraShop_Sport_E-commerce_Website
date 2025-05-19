const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Category = sequelize.define("Category", {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    type: {
      type: DataTypes.ENUM(
        "RACKET", // Vợt
        "SHOES", // Giày
        "SHUTTLECOCK", // Cầu
        "TAPE", // Băng
        "NET", // Lưới
        "ACCESSORIES" // Phụ kiện
      ),
      allowNull: false,
    },
  });

  Category.associate = (models) => {
    Category.hasMany(models.Product, {
      foreignKey: "categoryId",
      as: "products",
      onDelete: "CASCADE",
    });
  };

  return Category;
};
