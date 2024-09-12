const express = require("express");
const request = require("supertest");
const AuthController = require("../../../src/adapters/http/AuthController");
const AuthService = require("../../../src/application/AuthService");

jest.mock("../../../src/application/AuthService");

describe("AuthController", () => {
  let app;
  let authController;

  beforeEach(() => {
    authController = new AuthController();
    app = express();
    app.use(express.json());
    app.use("/", authController.router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /register", () => {
    it("deve registrar um usuário com sucesso", async () => {
      AuthService.prototype.register.mockResolvedValue();

      const response = await request(app)
        .post("/register")
        .send({ username: "ley", password: "123" });

      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe("User registered successfully");
    });

    it("deve retornar um erro 400 se o registro falhar", async () => {
      AuthService.prototype.register.mockRejectedValue(
        new Error("Erro no registro"),
      );

      const response = await request(app)
        .post("/register")
        .send({ username: "ley", password: "123" });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("Erro no registro");
    });
  });

  describe("POST /login", () => {
    it("deve autenticar um usuário com sucesso e retornar um token", async () => {
      AuthService.prototype.login.mockResolvedValue({
        token: "fake-jwt-token",
      });

      const response = await request(app)
        .post("/login")
        .send({ username: "john_doe", password: "securepassword" });

      expect(response.statusCode).toBe(200);
      expect(response.body.token).toBe("fake-jwt-token");
    });

    it("deve retornar um erro 400 se as credenciais forem inválidas", async () => {
      AuthService.prototype.login.mockRejectedValue(
        new Error("Credenciais inválidas"),
      );

      const response = await request(app)
        .post("/login")
        .send({ username: "john_doe", password: "wrongpassword" });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe("Credenciais inválidas");
    });
  });
});
