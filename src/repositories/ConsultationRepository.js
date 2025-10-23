const Consultation = require("../models/Consultation");

class ConsultationRepository {
  async create(data) {
    const consultation = new Consultation(data);
    return await consultation.save();
  }

  async findById(id) {
    return await Consultation.findById(id)
      .populate("patient")
      .populate("medecin")
      .populate("rendezVous");
  }

  async findByPatient(patientId) {
    return await Consultation.find({ patient: patientId }).sort({
      createdAt: -1,
    });
  }
}

module.exports = new ConsultationRepository();
