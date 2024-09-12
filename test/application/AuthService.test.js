const AuthService = require("../../src/application/AuthService");
const User = require("../../src/core/models/User");
const jwt = require("jsonwebtoken");
const sinon = require("sinon");

describe("AuthService", () => {
  let authService;

  beforeEach(() => {
    authService = new AuthService();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("register", () => {
    it("deve salvar um novo usuário e retornar o objeto do usuário", async () => {
      const username = "testUser";
      const password = "testPass";
      const saveStub = sinon.stub(User.prototype, "save").resolves();
      const userStub = sinon.stub(User, "findOne").resolves(null);

      const user = await authService.register(username, password);

      expect(saveStub.calledOnce).toBe(true);
      expect(user.username).toBe(username);
      expect(user.password).toBe(password);
    });
  });

  describe("login", () => {
    it("deve retornar um token se as credenciais forem válidas", async () => {
      const username = "testUser";
      const password = "testPass";
      const user = {
        _id: "123",
        username,
        password,
        comparePassword: sinon.stub().resolves(true),
      };
      sinon.stub(User, "findOne").resolves(user);
      const signStub = sinon.stub(jwt, "sign").returns("mockToken");

      const result = await authService.login(username, password);

      expect(user.comparePassword.calledOnceWith(password)).toBe(true);
      expect(signStub.calledOnce).toBe(true);
      expect(result.token).toBe("mockToken");
    });

    it("deve lançar um erro se as credenciais forem inválidas", async () => {
      const username = "testUser";
      const password = "wrongPass";
      const user = { comparePassword: sinon.stub().resolves(false) };
      sinon.stub(User, "findOne").resolves(user);

      await expect(authService.login(username, password)).rejects.toThrow(
        "Invalid credentials",
      );
    });

    it("deve lançar um erro se o usuário não existir", async () => {
      const username = "nonExistentUser";
      const password = "somePass";
      sinon.stub(User, "findOne").resolves(null);

      await expect(authService.login(username, password)).rejects.toThrow(
        "Invalid credentials",
      );
    });
  });

  describe("authenticate", () => {
    it("deve retornar o userId se o token for válido", async () => {
      const token = "validToken";
      const decoded = { userId: "123" };
      sinon.stub(jwt, "verify").returns(decoded);

      const userId = await authService.authenticate(token);

      expect(userId).toBe(decoded.userId);
    });

    it("deve lançar um erro se o token for inválido", async () => {
      const token = "invalidToken";
      sinon.stub(jwt, "verify").throws(new Error("Invalid token"));

      await expect(authService.authenticate(token)).rejects.toThrow(
        "Invalid token",
      );
    });
  });
});
