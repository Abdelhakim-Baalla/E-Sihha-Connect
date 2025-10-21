const mongoose = require("mongoose");

const rendezVousSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  duree: { type: Number, required: true },
  statut: {
    type: String,
    enum: ["confirmé", "annulé", "en attente"],
    default: "en attente",
  },
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
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("RendezVous", rendezVousSchema);
