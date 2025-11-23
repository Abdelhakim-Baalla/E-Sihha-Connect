const PatientDocument = require("../models/PatientDocument");

class PatientDocumentRepository {
  async create(data) {
    const document = new PatientDocument(data);
    return await document.save();
  }

  async findByPatient(patientId, filters = {}) {
    const query = { patient: patientId };

    if (filters.type) {
      query.type = filters.type;
    }

    return await PatientDocument.find(query)
      .populate("uploadedBy", "nom prenom")
      .sort({ createdAt: -1 });
  }

  async findById(id) {
    return await PatientDocument.findById(id)
      .populate("patient", "nom prenom utilisateur")
      .populate("uploadedBy", "nom prenom");
  }

  async deleteById(id) {
    return await PatientDocument.findByIdAndDelete(id);
  }
}

module.exports = new PatientDocumentRepository();
