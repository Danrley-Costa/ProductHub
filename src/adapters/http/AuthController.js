const express = require("express");
const AuthService = require("../../application/AuthService");

class AuthController {
  constructor() {
    this.authService = new AuthService();
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/register", this.register.bind(this));
    this.router.post("/login", this.login.bind(this));
  }
  /**
   * @swagger
   * /register:
   *   post:
   *     summary: Registro de um novo usuário
   *     description: Cria um novo usuário com nome de usuário e senha.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *                 example: ley
   *               password:
   *                 type: string
   *                 example: 123
   *     responses:
   *       '201':
   *         description: Usuário registrado com sucesso
   *       '400':
   *         description: Solicitação inválida
   */

  async register(req, res) {
    try {
      const { username, password } = req.body;
      await this.authService.register(username, password);
      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
  /**
   * @swagger
   * /login:
   *   post:
   *     summary: Login de um usuário
   *     description: Autentica um usuário e retorna um token JWT.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *                 example: john_doe
   *               password:
   *                 type: string
   *                 example: securepassword
   *     responses:
   *       '200':
   *         description: Login bem-sucedido
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
   *       '400':
   *         description: Credenciais inválidas
   *       '401':
   *         description: Token não fornecido ou inválido
   */
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const { token } = await this.authService.login(username, password);
      res.status(200).json({ token });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

module.exports = AuthController;
