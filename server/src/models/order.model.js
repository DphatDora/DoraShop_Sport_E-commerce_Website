const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Order = sequelize.define("Order", {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    rating: { type: DataTypes.INTEGER, allowNull: true },
    review: { type: DataTypes.STRING, allowNull: true },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    shippingAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "confirmed",
        "shipping",
        "delivered",
        "cancelled"
      ),
      defaultValue: "pending",
      allowNull: false,
    },
  });

  Order.associate = (models) => {
    Order.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
    Order.hasMany(models.OrderItem, {
      foreignKey: "orderId",
      as: "items",
      onDelete: "CASCADE",
    });
  };

  return Order;
};