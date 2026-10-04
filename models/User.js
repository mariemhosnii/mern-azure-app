// Mongoose model for a User
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },               // mandatory text
  email: { type: String, required: true, unique: true }, // mandatory and unique
  age: { type: Number },                                  // optional number
});

// Export the model so server.js can use it
module.exports = mongoose.model("User", userSchema);
