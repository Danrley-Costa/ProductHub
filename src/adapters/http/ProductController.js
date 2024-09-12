const express = require("express");
const authenticateToken = require("../../middleware/authMiddleware");

class ProductController {
  constructor(productService) {
    this.productService = productService;
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      "/products",
      authenticateToken,
      this.createProduct.bind(this),
    );
    this.router.get(
      "/products",
      authenticateToken,
      this.getAllProducts.bind(this),
    );
    this.router.get(
      "/products/:id",
      authenticateToken,
      this.getProductById.bind(this),
    );
    this.router.put(
      "/products/:id",
      authenticateToken,
      this.updateProduct.bind(this),
    );
    this.router.delete(
      "/products/:id",
      authenticateToken,
      this.deleteProduct.bind(this),
    );
  }

  /**
   * @openapi
   * /products:
   *   post:
   *     summary: Cria um novo produto
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               description:
   *                 type:
   *               quantity:
   *                 type: number
   *               price:
   *                 type: number
   *     responses:
   *       201:
   *         description: Produto criado com sucesso
   *       400:
   *         description: Dados inválidos
   */
  async createProduct(req, res) {
    try {
      const { name, description, quantity, price } = req.body;
      const { userId } = req;
      const product = await this.productService.createProduct(
        userId,
        name,
        description,
        quantity,
        price,
      );
      res.status(201).json(product);
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).send({ message: error.message });
      }
      res.status(500).send({ message: "Erro no servidor" });
    }
  }

  /**
   * @openapi
   * /products:
   *   get:
   *     summary: Retorna todos os produtos
   *     responses:
   *       200:
   *         description: Lista de produtos
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                   name:
   *                     type: string
   *                   description:
   *                     type: string
   *                   quantity:
   *                     type: string
   *                   price:
   *                     type: number
   */
  async getAllProducts(req, res) {
    try {
      const { userId } = req;
      const products = await this.productService.getAllProducts(userId);
      res.json(products);
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).send({ message: error.message });
      }
      res.status(500).send({ message: "Erro no servidor" });
    }
  }

  /**
   * @openapi
   * /products/{id}:
   *   get:
   *     summary: Retorna um produto pelo ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Produto encontrado
   *       404:
   *         description: Produto não encontrado
   */
  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req;
      const product = await this.productService.getProductById(id, userId);
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).send({ message: error.message });
      }
      res.status(500).send({ message: "Erro no servidor" });
    }
  }

  /**
   * @openapi
   * /products/{id}:
   *   get:
   *     summary: Retorna um produto pelo Nome
   *     parameters:
   *       - in: path
   *         name: nome do produto
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Produto encontrado
   *       404:
   *         description: Produto não encontrado
   */
  async getProductByName(req, res) {
    const { name } = req.params;
    const { userId } = req;
    const product = await this.productService.getProductByName(name, userId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  }

  /**
   * @openapi
   * /products/{id}:
   *   put:
   *     summary: Atualiza um produto
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               description:
   *                 type: string
   *               quantity:
   *                 type: number
   *               price:
   *                 type: number
   *     responses:
   *       200:
   *         description: Produto atualizado com sucesso
   *       404:
   *         description: Produto não encontrado
   */
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const { name, description, quantity, price } = req.body;
      const { userId } = req;
      const product = await this.productService.updateProduct(
        id,
        userId,
        name,
        description,
        quantity,
        price,
      );
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).send({ message: error.message });
      }
      res.status(500).send({ message: "Erro no servidor" });
    }
  }

  /**
   * @openapi
   * /products/{id}:
   *   delete:
   *     summary: Remove um produto
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: Produto removido com sucesso
   *       404:
   *         description: Produto não encontrado
   */
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req;
      const success = await this.productService.deleteProduct(id, userId);
      if (success) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).send({ message: error.message });
      }
      res.status(500).send({ message: "Erro no servidor" });
    }
  }
}

module.exports = ProductController;
