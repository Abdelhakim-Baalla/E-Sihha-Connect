const LabOrderRepository = require("../repositories/LabOrderRepository");
const PatientRepository = require("../repositories/PatientRepository");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const {
  decorateOrderWithFlags,
  decorateOrdersWithFlags,
} = require("../utils/labResultFlagger");
const { generateLabOrderPdf } = require("../utils/labOrderPdfGenerator");

const testSchema = Joi.object({
  code: Joi.string().optional(),
  nom: Joi.string().required(),
  instructions: Joi.string().optional(),
  resultatValeur: Joi.number().optional(),
  resultatUnite: Joi.string().optional(),
  referenceMin: Joi.number().optional(),
  referenceMax: Joi.number().optional(),
});

const createSchema = Joi.object({
  patient: Joi.string().required(),
  consultation: Joi.string().optional(),
  tests: Joi.array().items(testSchema).min(1).required(),
});

const parsePositiveInteger = (value, fallback) => {
  const parsed = parseInt(value, 10);
  if (Number.isFinite(parsed) && parsed > 0) return parsed;
  return fallback;
};

const linkTtlMinutes = parsePositiveInteger(
  process.env.LAB_REPORT_LINK_TTL_MIN,
  10
);

const linkSecret =
  process.env.LAB_REPORT_LINK_SECRET || process.env.JWT_SECRET || "";

const buildDownloadUrl = (req, orderId, token) => {
  const baseUrl =
    process.env.APP_BASE_URL || `${req.protocol}://${req.get("host")}`;
  return `${baseUrl}/api/v1/laborders/${orderId}/report?token=${token}`;
};

exports.createLabOrder = async (req, res) => {
  const medecinId = req.utilisateur && req.utilisateur.id;
  if (!medecinId) return res.status(403).json({ error: "Accès refusé" });

  const { error } = createSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const { patient, consultation, tests } = req.body;
    const patientDoc = await PatientRepository.findById(patient);
    if (!patientDoc)
      return res.status(404).json({ error: "Patient non trouvé" });

    const order = await LabOrderRepository.create({
      patient,
      medecin: medecinId,
      consultation,
      tests,
      statut: "ordered",
    });

    res.status(201).json(decorateOrderWithFlags(order));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getByPatient = async (req, res) => {
  try {
    const orders = await LabOrderRepository.findByPatient(req.params.patientId);
    res.json(decorateOrdersWithFlags(orders));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const ensureLabResponsableAccess = (req, res, next) => {
  if (!req.utilisateur || !req.utilisateur.role)
    return res.status(401).json({ error: "Utilisateur non authentifié" });

  const roleName = req.utilisateur.roleName;
  if (roleName && roleName === "responsable-labo") return next();

  if (req.utilisateur.roles && Array.isArray(req.utilisateur.roles)) {
    const hasRole = req.utilisateur.roles.some(
      (r) => r.nom === "responsable-labo"
    );
    if (hasRole) return next();
  }

  return res
    .status(403)
    .json({ error: "Accès réservé au responsable de laboratoire" });
};

exports.ensureLabResponsableAccess = ensureLabResponsableAccess;

exports.getById = async (req, res) => {
  try {
    const order = await LabOrderRepository.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Ordre non trouvé" });
    res.json(decorateOrderWithFlags(order));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMine = async (req, res) => {
  try {
    if (!req.utilisateur || !req.utilisateur.id)
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    const patient = await PatientRepository.findByUserId(req.utilisateur.id);
    if (!patient) return res.status(404).json({ error: "Patient non trouvé" });
    const orders = await LabOrderRepository.findByPatient(patient._id);
    res.json(decorateOrdersWithFlags(orders));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyResults = async (req, res) => {
  try {
    if (!req.utilisateur || !req.utilisateur.id)
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    const patient = await PatientRepository.findByUserId(req.utilisateur.id);
    if (!patient) return res.status(404).json({ error: "Patient non trouvé" });

    const completedOrders = await LabOrderRepository.findByPatientAndStatus(
      patient._id,
      ["completed"]
    );

    res.json(decorateOrdersWithFlags(completedOrders));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLabOrderDownloadLink = async (req, res) => {
  try {
    if (!req.utilisateur || !req.utilisateur.id)
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    if (!linkSecret)
      return res
        .status(500)
        .json({ error: "Configuration manquante pour la génération du lien" });

    const order = await LabOrderRepository.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Ordre non trouvé" });

    const medecinId = req.utilisateur.id;
    const medecinFromOrder =
      order.medecin && order.medecin._id
        ? order.medecin._id.toString()
        : order.medecin
        ? order.medecin.toString()
        : null;

    if (!medecinFromOrder || medecinFromOrder !== medecinId)
      return res.status(403).json({ error: "Accès refusé" });

    const expiresInMinutes = linkTtlMinutes;
    const token = jwt.sign(
      {
        orderId: order._id.toString(),
        subjectId: medecinId,
        subjectType: "medecin",
      },
      linkSecret,
      { expiresIn: `${expiresInMinutes}m` }
    );

    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

    res.json({
      url: buildDownloadUrl(req, order._id, token),
      expiresAt: expiresAt.toISOString(),
      ttlMinutes: expiresInMinutes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getLabOrderDownloadLinkForPatient = async (req, res) => {
  try {
    if (!req.utilisateur || !req.utilisateur.id)
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    if (!linkSecret)
      return res
        .status(500)
        .json({ error: "Configuration manquante pour la génération du lien" });

    const patient = await PatientRepository.findByUserId(req.utilisateur.id);
    if (!patient) return res.status(404).json({ error: "Patient non trouvé" });

    const order = await LabOrderRepository.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Ordre non trouvé" });

    const patientFromOrder =
      order.patient && order.patient._id
        ? order.patient._id.toString()
        : order.patient
        ? order.patient.toString()
        : null;

    if (!patientFromOrder || patientFromOrder !== patient._id.toString()) {
      return res
        .status(403)
        .json({ error: "Accès refusé : cet ordre ne vous appartient pas" });
    }

    const expiresInMinutes = linkTtlMinutes;
    const token = jwt.sign(
      {
        orderId: order._id.toString(),
        subjectId: patient._id.toString(),
        subjectType: "patient",
      },
      linkSecret,
      { expiresIn: `${expiresInMinutes}m` }
    );

    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

    res.json({
      url: buildDownloadUrl(req, order._id, token),
      expiresAt: expiresAt.toISOString(),
      ttlMinutes: expiresInMinutes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.downloadLabOrderReport = async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ error: "Token requis" });
  if (!linkSecret)
    return res
      .status(500)
      .json({ error: "Configuration manquante pour la génération du lien" });

  try {
    const payload = jwt.verify(token, linkSecret);
    if (!payload || payload.orderId !== req.params.id)
      return res.status(403).json({ error: "Token invalide" });

    const order = await LabOrderRepository.findById(payload.orderId);
    if (!order) return res.status(404).json({ error: "Ordre non trouvé" });

    const medecinFromOrder =
      order.medecin && order.medecin._id
        ? order.medecin._id.toString()
        : order.medecin
        ? order.medecin.toString()
        : null;
    const patientFromOrder =
      order.patient && order.patient._id
        ? order.patient._id.toString()
        : order.patient
        ? order.patient.toString()
        : null;

    const isAuthorizedDoctor =
      payload.subjectType === "medecin" &&
      medecinFromOrder === payload.subjectId;
    const isAuthorizedPatient =
      payload.subjectType === "patient" &&
      patientFromOrder === payload.subjectId;

    if (!isAuthorizedDoctor && !isAuthorizedPatient)
      return res.status(403).json({ error: "Token invalide" });

    const pdfBuffer = await generateLabOrderPdf(order);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=rapport-labo-${payload.orderId}.pdf`,
      "Content-Length": pdfBuffer.length,
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    const status = err.name === "TokenExpiredError" ? 410 : 400;
    const message =
      err.name === "TokenExpiredError" ? "Lien expiré" : "Token invalide";
    res.status(status).json({ error: message });
  }
};
