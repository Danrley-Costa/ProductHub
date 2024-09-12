const express = require("express");
const setupSwagger = require("./swagger");
const connectDB = require("./config/mongoose");
const nconf = require("nconf");
const cors = require("cors");
const ProductService = require("./application/ProductService");
const ProductController = require("./adapters/http/ProductController");
const AuthController = require("./adapters/http/AuthController");

const app = express();
const PORT = nconf.get("PORT") || 3000;
const authController = new AuthController();
const productService = new ProductService();
const productController = new ProductController(productService);
app.use(express.json());
app.use(cors());
app.use("/", authController.router);
app.use("/", productController.router);
try {
  connectDB();
} catch (error) {
  console.error("Error connecting to MongoDB:", error);
}

setupSwagger(app);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
