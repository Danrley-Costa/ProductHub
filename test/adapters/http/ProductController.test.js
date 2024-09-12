const request = require("supertest");
const express = require("express");
const ProductController = require("../../../src/adapters/http/ProductController");
jest.mock("../../../src/middleware/authMiddleware", () => {
  return jest.fn((req, res, next) => {
    req.userId = "mockUserId";
    next();
  });
});

describe("ProductController", () => {
  let app;
  let productServiceMock;

  beforeEach(() => {
    productServiceMock = {
      createProduct: jest.fn(),
      getAllProducts: jest.fn(),
      getProductById: jest.fn(),
      getProductByName: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(),
    };

    const productController = new ProductController(productServiceMock);
    app = express();
    app.use(express.json());
    app.use("/api", productController.router);
  });

  describe("POST /products", () => {
    it("should create a new product and return 201", async () => {
      const product = {
        name: "Product 1",
        description: "Description",
        quantity: 10,
        price: 100,
      };
      productServiceMock.createProduct.mockResolvedValue(product);

      const response = await request(app).post("/api/products").send(product);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(product);
      expect(productServiceMock.createProduct).toHaveBeenCalledWith(
        "mockUserId",
        "Product 1",
        "Description",
        10,
        100,
      );
    });

    it("should return 400 for invalid data", async () => {
      const invalidProduct = {
        name: "",
        description: "",
        quantity: -1,
        price: -10,
      };
      const validationError = new Error("ValidationError");
      validationError.name = "ValidationError";

      productServiceMock.createProduct.mockRejectedValue(validationError);

      const response = await request(app)
        .post("/api/products")
        .send(invalidProduct);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("ValidationError");
      expect(productServiceMock.createProduct).toHaveBeenCalledWith(
        "mockUserId",
        "",
        "",
        -1,
        -10,
      );
    });

    it("should return 500 for server error", async () => {
      productServiceMock.createProduct.mockRejectedValue(
        new Error("Server Error"),
      );

      const response = await request(app).post("/api/products").send({});

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Erro no servidor");
    });
  });

  describe("GET /products", () => {
    it("should return all products", async () => {
      const products = [
        {
          id: 1,
          name: "Product 1",
          description: "Description",
          quantity: 10,
          price: 100,
        },
      ];
      productServiceMock.getAllProducts.mockResolvedValue(products);

      const response = await request(app).get("/api/products");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(products);
    });

    it("should return 500 for server error", async () => {
      productServiceMock.getAllProducts.mockRejectedValue(
        new Error("Server Error"),
      );

      const response = await request(app).get("/api/products");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Erro no servidor");
    });
  });

  describe("GET /products/:id", () => {
    it("should return a product by id", async () => {
      const product = {
        id: 1,
        name: "Product 1",
        description: "Description",
        quantity: 10,
        price: 100,
      };
      productServiceMock.getProductById.mockResolvedValue(product);

      const response = await request(app).get("/api/products/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(product);
    });

    it("should return 404 if product not found", async () => {
      productServiceMock.getProductById.mockResolvedValue(null);

      const response = await request(app).get("/api/products/999");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Product not found");
    });

    it("should return 500 for server error", async () => {
      productServiceMock.getProductById.mockRejectedValue(
        new Error("Server Error"),
      );

      const response = await request(app).get("/api/products/1");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Erro no servidor");
    });
  });

  describe("GET /products/:name", () => {
    it("should return a product by id", async () => {
      const product = {
        id: 1,
        name: "Product1",
        description: "Description",
        quantity: 10,
        price: 100,
      };
      productServiceMock.getProductById.mockResolvedValue(product);

      const response = await request(app).get("/api/products/Product1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(product);
    });

    it("should return 404 if product not found", async () => {
      productServiceMock.getProductById.mockResolvedValue(null);

      const response = await request(app).get("/api/products/Product1");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Product not found");
    });

    it("should return 500 for server error", async () => {
      productServiceMock.getProductById.mockRejectedValue(
        new Error("Server Error"),
      );

      const response = await request(app).get("/api/products/Product1");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Erro no servidor");
    });
  });

  describe("PUT /products/:id", () => {
    it("should update a product and return 200", async () => {
      const updatedProduct = {
        id: 1,
        name: "Updated Product",
        description: "Updated Description",
        quantity: 20,
        price: 200,
      };
      productServiceMock.updateProduct.mockResolvedValue(updatedProduct);

      const response = await request(app)
        .put("/api/products/1")
        .send(updatedProduct);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedProduct);
      expect(productServiceMock.updateProduct).toHaveBeenCalledWith(
        "1",
        expect.any(String),
        "Updated Product",
        "Updated Description",
        20,
        200,
      );
    });

    it("should return 404 if product not found", async () => {
      productServiceMock.updateProduct.mockResolvedValue(null);

      const response = await request(app)
        .put("/api/products/999")
        .send({ name: "Updated Product" });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Product not found");
    });

    it("should return 500 for server error", async () => {
      productServiceMock.updateProduct.mockRejectedValue(
        new Error("Server Error"),
      );

      const response = await request(app)
        .put("/api/products/1")
        .send({ name: "Updated Product" });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Erro no servidor");
    });
  });

  describe("DELETE /products/:id", () => {
    it("should delete a product and return 204", async () => {
      productServiceMock.deleteProduct.mockResolvedValue(true);

      const response = await request(app).delete("/api/products/1");

      expect(response.status).toBe(204);
    });

    it("should return 404 if product not found", async () => {
      productServiceMock.deleteProduct.mockResolvedValue(false);

      const response = await request(app).delete("/api/products/999");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Product not found");
    });

    it("should return 500 for server error", async () => {
      productServiceMock.deleteProduct.mockRejectedValue(
        new Error("Server Error"),
      );

      const response = await request(app).delete("/api/products/1");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Erro no servidor");
    });
  });
});
