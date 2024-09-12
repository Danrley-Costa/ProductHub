const jwt = require("jsonwebtoken");
const User = require("../core/models/User");
const nconf = require("nconf");

const JWT_SECRET = nconf.get("JWT_SECRET") || "your_jwt_secret";

class AuthService {
  async register(username, password) {
    const user = new User({ username, password });
    await user.save();
    return user;
  }

  async login(username, password) {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      throw new Error("Invalid credentials");
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    return { token };
  }

  async authenticate(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded.userId;
    } catch (err) {
      throw new Error("Invalid token");
    }
  }
}

module.exports = AuthService;
