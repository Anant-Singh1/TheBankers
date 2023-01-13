const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  created_At: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("Holder", userSchema);
