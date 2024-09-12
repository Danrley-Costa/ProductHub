const ProductService = require("../../src/application/ProductService");
const Product = require("../../src/core/models/Product");
jest.mock("../../src/core/models/Product");

describe("ProductService", () => {
  let productService;

  beforeEach(() => {
    productService = new ProductService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createProduct", () => {
    it("should create a new product", async () => {
      const mockProduct = {
        save: jest.fn().mockResolvedValueOnce({ _id: "1", name: "Product 1" }),
      };
      Product.mockImplementation(() => mockProduct);

      const result = await productService.createProduct(
        "user1",
        "Product 1",
        "Description 1",
        10,
        100,
      );

      expect(mockProduct.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ _id: "1", name: "Product 1" });
    });
  });

  describe("getAllProducts", () => {
    it("should retrieve all products for a user", async () => {
      const mockProducts = [
        { _id: "1", name: "Product 1" },
        { _id: "2", name: "Product 2" },
      ];
      Product.find.mockResolvedValueOnce(mockProducts);

      const result = await productService.getAllProducts("user1");

      expect(Product.find).toHaveBeenCalledWith({ userId: "user1" });
      expect(result).toEqual(mockProducts);
    });
  });

  describe("getProductById", () => {
    it("should retrieve a product by its id", async () => {
      const mockProduct = { _id: "1", name: "Product 1" };
      Product.findOne.mockResolvedValueOnce(mockProduct);

      const result = await productService.getProductById("1", "user1");

      expect(Product.findOne).toHaveBeenCalledWith({
        id: "1",
        userId: "user1",
      });
      expect(result).toEqual(mockProduct);
    });
  });

  describe("getProductByName", () => {
    it('should retrieve products by their name and userId', async () => {
      const mockProducts = [
        { _id: '1', name: 'Product 1', userId: 'user1' },
        { _id: '2', name: 'Product 1', userId: 'user1' }
      ];
      Product.find.mockResolvedValueOnce(mockProducts);
  
      const result = await productService.getProductByName('Product 1', 'user1');
  
      expect(Product.find).toHaveBeenCalledWith({ name: 'Product 1', userId: 'user1' });
      expect(result).toEqual(mockProducts);
    });
  });

  describe("updateProduct", () => {
    it("should update an existing product", async () => {
      const mockProduct = { _id: "1", name: "Updated Product" };
      Product.findOneAndUpdate.mockResolvedValueOnce(mockProduct);

      const result = await productService.updateProduct(
        "1",
        "user1",
        "Updated Product",
        "Updated Description",
        5,
        150,
      );

      expect(Product.findOneAndUpdate).toHaveBeenCalledWith(
        { id: "1", userId: "user1" },
        {
          name: "Updated Product",
          description: "Updated Description",
          quantity: 5,
          price: 150,
        },
        { new: true },
      );
      expect(result).toEqual(mockProduct);
    });
  });

  describe("deleteProduct", () => {
    it("should delete a product", async () => {
      const mockProduct = { _id: "1", name: "Product 1" };
      Product.findOneAndDelete.mockResolvedValueOnce(mockProduct);

      const result = await productService.deleteProduct("1", "user1");

      expect(Product.findOneAndDelete).toHaveBeenCalledWith({
        id: "1",
        userId: "user1",
      });
      expect(result).toEqual(mockProduct);
    });
  });
});
