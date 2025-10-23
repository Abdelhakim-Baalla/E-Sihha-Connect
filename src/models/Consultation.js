const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema({
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
  rendezVous: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RendezVous",
  },
  temperature: {
    type: Number,
  },
  tension_systolique: {
    type: Number,
  },
  tension_diastolique: {
    type: Number,
  },
  frequence_cardiaque: {
    type: Number,
  },
  frequence_respiratoire: {
    type: Number,
  },
  poids: {
    type: Number,
  },
  taille: {
    type: Number,
  },
  observations: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Consultation", consultationSchema);
