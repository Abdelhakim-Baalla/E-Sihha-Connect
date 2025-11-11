const { expect } = require("chai");
const { generateLabOrderPdf } = require("../src/utils/labOrderPdfGenerator");

const sampleOrder = {
  _id: "order123",
  statut: "ordered",
  createdAt: new Date().toISOString(),
  patient: { nom: "Doe", prenom: "Jane", email: "jane.doe@email.com" },
  medecin: { nom: "House", prenom: "Gregory" },
  tests: [
    {
      code: "HB1",
      nom: "Hémogramme",
      resultatValeur: 12.5,
      resultatUnite: "g/dL",
      referenceMin: 12,
      referenceMax: 16,
      flag: "normal",
    },
  ],
};

describe("labOrderPdfGenerator", () => {
  it("génère un buffer PDF non vide", async () => {
    const buffer = await generateLabOrderPdf(sampleOrder);
    expect(Buffer.isBuffer(buffer)).to.equal(true);
    expect(buffer.length).to.be.greaterThan(0);
  });
});
