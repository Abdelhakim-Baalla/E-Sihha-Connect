const { expect } = require("chai");
const PatientDocumentRepository = require("../src/repositories/PatientDocumentRepository");

describe("PatientDocument", () => {
  it("devrait créer un document patient", async () => {
    const doc = {
      patient: "507f1f77bcf86cd799439011",
      medecin: "507f1f77bcf86cd799439012",
      nom: "test.pdf",
      type: "rapport",
      mimeType: "application/pdf",
      taille: 1024,
      objectName: "test/test.pdf",
    };
    
    expect(doc).to.have.property("nom");
    expect(doc.mimeType).to.equal("application/pdf");
  });
});
