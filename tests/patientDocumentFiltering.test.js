const { expect } = require("chai");
const mongoose = require("mongoose");
const PatientDocumentRepository = require("../src/repositories/PatientDocumentRepository");
const PatientDocument = require("../src/models/PatientDocument");

describe("PatientDocumentRepository Filtering", () => {
  const patientId = new mongoose.Types.ObjectId();
  const uploaderId = new mongoose.Types.ObjectId();

  beforeEach(async () => {
    await PatientDocument.deleteMany({});
    
    await PatientDocumentRepository.create({
      patient: patientId,
      uploadedBy: uploaderId,
      nom: "doc1.pdf",
      type: "rapport",
      mimeType: "application/pdf",
      taille: 1000,
      objectName: "doc1",
      createdAt: new Date("2023-01-01T10:00:00Z")
    });
    
    await PatientDocumentRepository.create({
      patient: patientId,
      uploadedBy: uploaderId,
      nom: "doc2.pdf",
      type: "image",
      mimeType: "image/jpeg",
      taille: 1000,
      objectName: "doc2",
      createdAt: new Date("2023-01-02T10:00:00Z")
    });

    await PatientDocumentRepository.create({
      patient: patientId,
      uploadedBy: uploaderId,
      nom: "doc3.pdf",
      type: "rapport",
      mimeType: "application/pdf",
      taille: 1000,
      objectName: "doc3",
      createdAt: new Date("2023-01-03T10:00:00Z")
    });
  });

  it("should filter by specific date", async () => {
    const results = await PatientDocumentRepository.findByPatient(patientId, { date: "2023-01-02" });
    expect(results).to.have.lengthOf(1);
    expect(results[0].nom).to.equal("doc2.pdf");
  });

  it("should filter by start date", async () => {
    const results = await PatientDocumentRepository.findByPatient(patientId, { startDate: "2023-01-02" });
    expect(results).to.have.lengthOf(2); // doc2 and doc3
    const names = results.map(d => d.nom);
    expect(names).to.include("doc2.pdf");
    expect(names).to.include("doc3.pdf");
  });

  it("should filter by end date", async () => {
    const results = await PatientDocumentRepository.findByPatient(patientId, { endDate: "2023-01-02" });
    expect(results).to.have.lengthOf(2); // doc1 and doc2
    const names = results.map(d => d.nom);
    expect(names).to.include("doc1.pdf");
    expect(names).to.include("doc2.pdf");
  });

  it("should filter by date range", async () => {
    const results = await PatientDocumentRepository.findByPatient(patientId, { 
      startDate: "2023-01-01", 
      endDate: "2023-01-02" 
    });
    expect(results).to.have.lengthOf(2); // doc1 and doc2
  });

  it("should combine type and date filters", async () => {
    const results = await PatientDocumentRepository.findByPatient(patientId, { 
      type: "rapport",
      startDate: "2023-01-02" 
    });
    expect(results).to.have.lengthOf(1); // doc3
    expect(results[0].nom).to.equal("doc3.pdf");
  });
});
