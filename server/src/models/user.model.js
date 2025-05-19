const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define("User", {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING},
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING},
    avatar: { type: DataTypes.STRING}
  });

  User.associate = (models) => {
    User.hasMany(models.Order, {
      foreignKey: "userId",
      as: "orders",
      onDelete: "CASCADE",
    });
  };

  return User;
};
