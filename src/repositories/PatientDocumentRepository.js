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

    if (filters.date) {
      // Filter by specific date (ignoring time) - Use UTC to match stored dates
      const startOfDay = new Date(filters.date);
      startOfDay.setUTCHours(0, 0, 0, 0);
      
      const endOfDay = new Date(filters.date);
      endOfDay.setUTCHours(23, 59, 59, 999);
      
      query.createdAt = {
        $gte: startOfDay,
        $lte: endOfDay
      };
    } else if (filters.startDate || filters.endDate) {
      // Filter by date range
      query.createdAt = {};
      if (filters.startDate) {
        query.createdAt.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        const end = new Date(filters.endDate);
        end.setUTCHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
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
