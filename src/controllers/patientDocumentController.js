const PatientDocumentRepository = require("../repositories/PatientDocumentRepository");
const PatientRepository = require("../repositories/PatientRepository");
const { minioClient, BUCKET_NAME } = require("../config/minio");
const { v4: uuidv4 } = require("uuid");

const MAX_FILE_SIZE = 20 * 1024 * 1024;

exports.uploadDocument = async (req, res) => {
  const medecinId = req.utilisateur?.id;
  if (!medecinId) return res.status(403).json({ error: "Accès refusé" });

  if (!req.file) return res.status(400).json({ error: "Aucun fichier fourni" });

  const { patientId } = req.params;
  const { nom, description, type } = req.body;

  try {
    const patient = await PatientRepository.findById(patientId);
    if (!patient) return res.status(404).json({ error: "Patient non trouvé" });

    if (req.file.size > MAX_FILE_SIZE) {
      return res.status(400).json({ error: "Fichier trop volumineux (max 20MB)" });
    }

    const objectName = `${patientId}/${uuidv4()}-${req.file.originalname}`;

    await minioClient.putObject(
      BUCKET_NAME,
      objectName,
      req.file.buffer,
      req.file.size,
      { "Content-Type": req.file.mimetype }
    );

    const document = await PatientDocumentRepository.create({
      patient: patientId,
      medecin: medecinId,
      nom: nom || req.file.originalname,
      description,
      type: type || "autre",
      mimeType: req.file.mimetype,
      taille: req.file.size,
      objectName,
    });

    res.status(201).json(document);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPatientDocuments = async (req, res) => {
  try {
    const documents = await PatientDocumentRepository.findByPatient(req.params.patientId);
    res.json(documents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.downloadDocument = async (req, res) => {
  try {
    const document = await PatientDocumentRepository.findById(req.params.id);
    if (!document) return res.status(404).json({ error: "Document non trouvé" });

    const dataStream = await minioClient.getObject(BUCKET_NAME, document.objectName);

    res.set({
      "Content-Type": document.mimeType,
      "Content-Disposition": `attachment; filename="${document.nom}"`,
    });

    dataStream.pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteDocument = async (req, res) => {
  const medecinId = req.utilisateur?.id;

  try {
    const document = await PatientDocumentRepository.findById(req.params.id);
    if (!document) return res.status(404).json({ error: "Document non trouvé" });

    if (document.medecin._id.toString() !== medecinId) {
      return res.status(403).json({ error: "Seul le médecin qui a uploadé peut supprimer" });
    }

    await minioClient.removeObject(BUCKET_NAME, document.objectName);
    await PatientDocumentRepository.deleteById(req.params.id);

    res.json({ message: "Document supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
