const LabOrder = require("../models/LabOrder");

class LabOrderRepository {
  async create(data) {
    const order = new LabOrder(data);
    return await order.save();
  }

  async findById(id) {
    return await LabOrder.findById(id)
      .populate("patient")
      .populate("medecin")
      .populate("consultation");
  }

  async findByPatient(patientId) {
    return await LabOrder.find({ patient: patientId }).sort({ createdAt: -1 });
  }

  async findByPatientAndStatus(patientId, statuses = []) {
    return await LabOrder.find({
      patient: patientId,
      statut: { $in: statuses },
    }).sort({ createdAt: -1 });
  }
}

module.exports = new LabOrderRepository();
