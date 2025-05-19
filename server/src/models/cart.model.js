const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Cart = sequelize.define("Cart", {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  });

  Cart.associate = (models) => {
    Cart.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
    // Cart.hasMany(models.Product, {
    //   foreignKey: "cartId",
    //   as: "items",
    //   onDelete: "CASCADE",
    // });
    Cart.belongsToMany(models.Product, {
      through: "Cart_Product", // Tên bảng trung gian
      foreignKey: "cartId",
      otherKey: "productId",
      as: "items",
    });
  };

  return Cart;
};
