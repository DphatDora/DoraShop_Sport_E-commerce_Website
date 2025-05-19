const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Coupon = sequelize.define("Coupon", {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    code: { type: DataTypes.STRING, allowNull: false },
    discountType: {
      type: DataTypes.ENUM("PERCENTAGE", "FIXED"), 
      allowNull: false,
    },
    discountValue: { type: DataTypes.DOUBLE, allowNull: false },
    expiryDate: { type: DataTypes.DATE, allowNull: false },
  });

  return Coupon;
};
