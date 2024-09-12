const Product = require("../core/models/Product");

class ProductService {
  async createProduct(userId, name, description, quantity, price) {
    const newProduct = new Product({
      userId,
      name,
      description,
      quantity,
      price,
    });
    return await newProduct.save();
  }

  async getAllProducts(userId) {
    const products = await Product.find({ userId: userId });
    return products;
  }

  async getProductById(id, userId) {
    return await Product.findOne({ id: id, userId });
  }

  async getProductByName(name, userId) {
    return await Product.find({ name: name, userId });
  }

  async updateProduct(id, userId, name, description, quantity, price) {
    return await Product.findOneAndUpdate(
      { id, userId },
      { name, description, quantity, price },
      { new: true },
    );
  }

  async deleteProduct(id, userId) {
    return await Product.findOneAndDelete({ id: id, userId });
  }
}

module.exports = ProductService;
