const mongoose = require("mongoose");

const allergieSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Allergie", allergieSchema);
