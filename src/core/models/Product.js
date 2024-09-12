const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const ProductSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    unique: true,
    default: uuidv4,
  },
  quantity: {
    type: Number,
    required: [true, "A quantidade do produto é obrigatória."],
    min: [1, "A quantidade do produto deve ser maior que 0."],
  },
  name: {
    type: String,
    required: [true, "O nome do produto é obrigatório."],
    minlength: [3, "O nome do produto deve ter pelo menos 3 caracteres."],
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: [true, "O preço do produto é obrigatório."],
    min: [0.01, "O preço do produto deve ser maior que 0."],
  },
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
