const AuthService = require("../application/AuthService");
const authService = new AuthService();

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  try {
    const userId = await authService.authenticate(token);
    req.userId = userId;
    next();
  } catch (err) {
    res.sendStatus(403);
  }
};

module.exports = authenticateToken;
