const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Payment = sequelize.define("Payment", {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    paymentMethod: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.Order, {
      foreignKey: "orderId",
      as: "order",
    });
  };

  return Payment;
};
