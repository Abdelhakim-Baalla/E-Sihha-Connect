const Patient = require("../models/Patient");

class PatientRepository {
  async create(data) {
    const patient = new Patient(data);
    return await patient.save();
  }

  async findAll(filter = {}) {
    return await Patient.find(filter)
      .populate("allergies")
      .populate("medicalHistoriques");
  }

  async findById(id) {
    return await Patient.findById(id)
      .populate("allergies")
      .populate("medicalHistoriques");
  }

  async update(id, updates) {
    return await Patient.findByIdAndUpdate(id, updates, { new: true });
  }

  async delete(id) {
    return await Patient.findByIdAndDelete(id);
  }
}

module.exports = new PatientRepository();
