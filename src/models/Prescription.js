const mongoose = require("mongoose");

const medicamentSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  dosage: { type: String, required: true },
  voie: { type: String, required: true },
  frequence: { type: String, required: true },
  duree: { type: String, required: true },
  renouvellements: { type: Number, default: 0 },
});

const prescriptionSchema = new mongoose.Schema(
  {
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
    pharmacien: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Utilisateur",
    },
    consultation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consultation",
    },
    medicaments: {
      type: [medicamentSchema],
      default: [],
    },
    statut: {
      type: String,
      enum: [
        "draft",
        "signed",
        "sent",
        "active",
        "annulee",
        "envoyee",
        "dispensee",
      ],
      default: "draft",
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);
