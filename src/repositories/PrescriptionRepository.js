const Prescription = require("../models/Prescription");

class PrescriptionRepository {
  async create(data) {
    const prescription = new Prescription(data);
    return await prescription.save();
  }

  async findById(id) {
    return await Prescription.findById(id)
      .populate("patient")
      .populate("medecin")
      .populate("consultation");
  }

  async findByPatient(patientId) {
    return await Prescription.find({ patient: patientId }).sort({
      createdAt: -1,
    });
  }

  async findActiveByPatient(patientId) {
    return await Prescription.find({
      patient: patientId,
      statut: { $in: ["signed", "sent", "envoyee"] },
    }).sort({ createdAt: -1 });
  }

  async findByPharmacist(pharmacistId) {
    return await Prescription.find({ pharmacien: pharmacistId })
      .populate("patient", "nom prenom")
      .populate("medecin", "nom prenom")
      .sort({ createdAt: -1 });
  }

  async updateStatus(id, statut) {
    return await Prescription.findByIdAndUpdate(
      id,
      { statut, updatedAt: new Date() },
      { new: true }
    );
  }
}

module.exports = new PrescriptionRepository();
