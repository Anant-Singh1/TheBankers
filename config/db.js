const mongoose = require("mongoose");
require("dotenv").config();
const db = process.env.DB_URI;

mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
    });
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.error(err.message);
    // Exiting the process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
