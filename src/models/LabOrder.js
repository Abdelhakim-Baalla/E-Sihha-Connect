const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
  {
    code: { type: String },
    nom: { type: String, required: true },
    instructions: { type: String },
    resultatValeur: { type: Number },
    resultatUnite: { type: String },
    referenceMin: { type: Number },
    referenceMax: { type: Number },
  },
  { _id: false }
);

const labOrderSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  medecin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Utilisateur",
    required: true,
  },
  consultation: { type: mongoose.Schema.Types.ObjectId, ref: "Consultation" },
  tests: { type: [testSchema], default: [] },
  statut: {
    type: String,
    enum: ["ordered", "received", "completed", "cancelled"],
    default: "ordered",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("LabOrder", labOrderSchema);
