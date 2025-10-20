const mongoose = require("mongoose");

const medicalHistoriqueSchema = new mongoose.Schema({
  maladie: { type: String, required: true },
  traitement: { type: String },
  dateDebut: { type: Date },
  dateFin: { type: Date },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("MedicalHistorique", medicalHistoriqueSchema);
