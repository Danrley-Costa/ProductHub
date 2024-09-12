const mongoose = require("mongoose");
const config = require("./config");

const connectDB = async () => {
  try {
    const host = config.get("DB_HOST");
    const dbUser = config.get("DB_USER");
    const password = config.get("DB_PASSWORD");
    const dbName = config.get("DB_NAME");
    const uri = `mongodb+srv://${dbUser}:${password}@${host}/${dbName}?retryWrites=true&w=majority`;
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
};

module.exports = connectDB;
