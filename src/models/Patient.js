const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  date_naissance: { type: Date },
  sexe: { type: String, enum: ["Homme", "Femme"] },
  email: { type: String },
  telephone: { type: String },
  adresse: { type: String },
  allergies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Allergie" }],
  medicalHistoriques: [
    { type: mongoose.Schema.Types.ObjectId, ref: "MedicalHistorique" },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Patient", patientSchema);
