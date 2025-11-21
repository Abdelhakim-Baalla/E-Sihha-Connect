const mongoose = require("mongoose");

const patientDocumentSchema = new mongoose.Schema({
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
  nom: { type: String, required: true },
  description: { type: String },
  type: {
    type: String,
    enum: ["image", "rapport", "autre"],
    required: true,
  },
  mimeType: {
    type: String,
    enum: ["application/pdf", "image/jpeg", "image/png"],
    required: true,
  },
  taille: { type: Number, required: true },
  objectName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PatientDocument", patientDocumentSchema);
