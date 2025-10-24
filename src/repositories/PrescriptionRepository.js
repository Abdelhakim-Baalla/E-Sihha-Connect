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
}

module.exports = new PrescriptionRepository();
