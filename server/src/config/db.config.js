require("dotenv").config();

module.exports = {
  HOST: process.env.HOST_NAME,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB_NAME,
  dialect: "mysql",
};
