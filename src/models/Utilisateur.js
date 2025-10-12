const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { Role } = require("./Role");

const utilisateurSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    required: true,
  },
  date_naissance: {
    type: Date,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    default: null,
  },
  active: {
    type: Boolean,
    default: false,
  },
  specialite: {
    type: String,
  },
  preferences: {
    type: mongoose.Schema.Types.Mixed,
  },
  resetToken: {
    type: String,
  },
  refreshToken: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  modifiedAt: {
    type: Date,
    default: Date.now,
  },
});

utilisateurSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model("Utilisateur", utilisateurSchema);
