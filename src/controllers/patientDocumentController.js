const PatientDocumentRepository = require("../repositories/PatientDocumentRepository");
const PatientRepository = require("../repositories/PatientRepository");
const { minioClient, BUCKET_NAME } = require("../config/minio");
const { v4: uuidv4 } = require("uuid");
const Role = require("../models/Role");

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"];

const isDoctorUser = async (utilisateur) => {
  if (!utilisateur?.role) return false;
  const role = await Role.findById(utilisateur.role).select("nom");
  return role?.nom === "medecin";
};

const canManagePatientDocuments = async (utilisateur, patient) => {
  if (!utilisateur || !patient) return false;
  if (patient.utilisateur?.toString() === utilisateur.id) {
    return true;
  }
  return await isDoctorUser(utilisateur);
};

exports.uploadDocument = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Aucun fichier fourni" });

  const { patientId } = req.params;
  const { nom, description, type } = req.body;

  try {
    const patient = await PatientRepository.findById(patientId);
    if (!patient) return res.status(404).json({ error: "Patient non trouvé" });

    const allowedUser = await canManagePatientDocuments(
      req.utilisateur,
      patient
    );
    if (!allowedUser) {
      return res.status(403).json({
        error: "Accès refusé : vous ne pouvez gérer que vos propres documents",
      });
    }

    if (req.file.size > MAX_FILE_SIZE) {
      return res
        .status(400)
        .json({ error: "Fichier trop volumineux (max 20MB)" });
    }

    if (!ALLOWED_MIME_TYPES.includes(req.file.mimetype)) {
      return res.status(400).json({
        error:
          "Type de fichier non autorisé. Seuls PDF, JPEG et PNG sont acceptés.",
      });
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
      uploadedBy: req.utilisateur.id,
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
    const { type } = req.query;
    const allowedTypes = ["image", "rapport", "autre"];

    if (type && !allowedTypes.includes(type)) {
      return res.status(400).json({
        error: "Type invalide. Valeurs autorisées: image, rapport, autre.",
      });
    }

    const patient = await PatientRepository.findById(req.params.patientId);
    if (!patient) {
      return res.status(404).json({ error: "Patient non trouvé" });
    }

    const allowedUser = await canManagePatientDocuments(
      req.utilisateur,
      patient
    );
    if (!allowedUser) {
      return res.status(403).json({ error: "Accès refusé" });
    }

    const documents = await PatientDocumentRepository.findByPatient(
      req.params.patientId,
      { type }
    );
    res.json(documents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.downloadDocument = async (req, res) => {
  try {
    const document = await PatientDocumentRepository.findById(req.params.id);
    if (!document)
      return res.status(404).json({ error: "Document non trouvé" });

    const allowedUser = await canManagePatientDocuments(
      req.utilisateur,
      document.patient
    );
    if (!allowedUser) {
      return res.status(403).json({ error: "Accès refusé" });
    }

    const dataStream = await minioClient.getObject(
      BUCKET_NAME,
      document.objectName
    );

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
  try {
    const document = await PatientDocumentRepository.findById(req.params.id);
    if (!document)
      return res.status(404).json({ error: "Document non trouvé" });

    const isPatientOwner =
      document.patient?.utilisateur?.toString() === req.utilisateur?.id;
    const uploadedById =
      document.uploadedBy?._id?.toString() || document.uploadedBy?.toString();
    const isUploader = uploadedById === req.utilisateur?.id;
    const isDoctorUploader =
      isUploader && (await isDoctorUser(req.utilisateur));

    if (!isPatientOwner && !isDoctorUploader) {
      return res.status(403).json({
        error:
          "Seul le patient concerné ou le professionnel qui a uploadé peut supprimer",
      });
    }

    await minioClient.removeObject(BUCKET_NAME, document.objectName);
    await PatientDocumentRepository.deleteById(req.params.id);

    res.json({ message: "Document supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
