const { Sequelize } = require("sequelize");
const dbConfig = require("../config/db.config");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  logging: false,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = require("./user.model")(sequelize);
db.Category = require("./category.model")(sequelize);
db.Product = require("./product.model")(sequelize);
db.ProductImage = require("./product-image.model")(sequelize);
db.Order = require("./order.model")(sequelize);
db.OrderItem = require("./order-item.model")(sequelize);
db.Coupon = require("./coupon.model")(sequelize);
db.Payment = require("./payment.model")(sequelize);
db.Cart = require("./cart.model")(sequelize);

// Khởi tạo các liên kết
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize
  .sync({ alter: true, force: false }) // Tạo bảng nếu chưa có
  .then(() => console.log("Database synchronized."))
  .catch((err) => console.error("Database sync error:", err));

module.exports = db;
