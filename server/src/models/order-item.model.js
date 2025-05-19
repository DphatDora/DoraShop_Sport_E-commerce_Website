const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const OrderItem = sequelize.define("OrderItem", {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    productName: { type: DataTypes.STRING, allowNull: false },
    productPrice: { type: DataTypes.FLOAT, allowNull: false },
    productImage: { type: DataTypes.STRING, allowNull: false },
  });

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, {
      foreignKey: "orderId",
      as: "order",
    });
    OrderItem.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "product",
    });
  };

  return OrderItem;
};


