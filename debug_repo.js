const mongoose = require("mongoose");
const PatientDocumentRepository = require("./src/repositories/PatientDocumentRepository");
const PatientDocument = require("./src/models/PatientDocument");
const connectDB = require("./src/config/db");
const dotenv = require("dotenv");

dotenv.config();

async function run() {
  console.log("Connecting to DB...");
  try {
    await connectDB();
    console.log("Connected to DB");
  } catch (e) {
    console.error("DB Connection failed:", e);
    return;
  }

  const patientId = new mongoose.Types.ObjectId();
  const uploaderId = new mongoose.Types.ObjectId();

  // Clean up
  await PatientDocument.deleteMany({ patient: patientId });

  // Create test documents
  const docs = [
    {
      patient: patientId,
      uploadedBy: uploaderId,
      nom: "doc1.pdf",
      type: "rapport",
      mimeType: "application/pdf",
      taille: 1000,
      objectName: "doc1",
      createdAt: new Date("2023-01-01T10:00:00Z")
    },
    {
      patient: patientId,
      uploadedBy: uploaderId,
      nom: "doc2.pdf",
      type: "image",
      mimeType: "image/jpeg",
      taille: 1000,
      objectName: "doc2",
      createdAt: new Date("2023-01-02T10:00:00Z")
    },
    {
      patient: patientId,
      uploadedBy: uploaderId,
      nom: "doc3.pdf",
      type: "rapport",
      mimeType: "application/pdf",
      taille: 1000,
      objectName: "doc3",
      createdAt: new Date("2023-01-03T10:00:00Z")
    }
  ];

  await PatientDocument.insertMany(docs);

  console.log("--- Testing Date Filter ---");
  const results = await PatientDocumentRepository.findByPatient(patientId, { date: "2023-01-02" });
  console.log("Results count:", results.length);
  results.forEach(d => console.log("Found:", d.nom, d.createdAt));

  if (results.length !== 1) {
    console.error("FAILED: Expected 1 result");
  } else if (results[0].nom !== "doc2.pdf") {
    console.error("FAILED: Expected doc2.pdf");
  } else {
    console.log("SUCCESS");
  }

  await mongoose.connection.close();
}

run().catch(console.error);
