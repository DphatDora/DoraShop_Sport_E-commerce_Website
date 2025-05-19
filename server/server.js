const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require("./src/routes/auth.routes");
const productRoutes = require("./src/routes/product.routes");
const categoryRoutes = require("./src/routes/category.routes");
const orderRoutes = require("./src/routes/order.routes");

const db = require("./src/models/index");
const path = require("path");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files từ thư mục uploads
app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));

app.use("/", authRoutes);
app.use("/product", productRoutes);
app.use("/cate", categoryRoutes);
app.use("/orders", orderRoutes);

const PORT = process.env.PORT || 3000;
db.sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to the database.");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch((err) => console.error("Unable to connect to the database:", err));
