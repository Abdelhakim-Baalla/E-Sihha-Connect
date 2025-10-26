const PrescriptionRepository = require("../repositories/PrescriptionRepository");
const PatientRepository = require("../repositories/PatientRepository");
const Joi = require("joi");

const medicamentSchema = Joi.object({
  nom: Joi.string().required(),
  dosage: Joi.string().required(),
  voie: Joi.string().required(),
  frequence: Joi.string().required(),
  duree: Joi.string().required(),
  renouvellements: Joi.number().min(0).optional(),
});

const createSchema = Joi.object({
  patient: Joi.string().required(),
  consultation: Joi.string().optional(),
  medicaments: Joi.array().items(medicamentSchema).min(1).required(),
  notes: Joi.string().optional(),
  statut: Joi.string()
    .valid("draft", "signed", "sent", "active", "annulee")
    .optional(),
});

exports.createPrescription = async (req, res) => {
  const medecinId = req.utilisateur && req.utilisateur.id;
  if (!medecinId) return res.status(403).json({ error: "Accès refusé" });

  const { error } = createSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const { patient, consultation, medicaments, notes, statut } = req.body;
    const patientDoc = await PatientRepository.findById(patient);
    if (!patientDoc)
      return res.status(404).json({ error: "Patient non trouvé" });

    const prescription = await PrescriptionRepository.create({
      patient,
      medecin: medecinId,
      consultation,
      medicaments,
      notes,
      statut: statut || "draft",
    });

    res.status(201).json(prescription);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getByPatient = async (req, res) => {
  try {
    const prescriptions = await PrescriptionRepository.findByPatient(
      req.params.patientId
    );
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const prescription = await PrescriptionRepository.findById(req.params.id);
    if (!prescription)
      return res.status(404).json({ error: "Prescription non trouvée" });
    res.json(prescription);
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
    const prescriptions = await PrescriptionRepository.findByPatient(
      patient._id
    );
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getActiveMine = async (req, res) => {
  try {
    if (!req.utilisateur || !req.utilisateur.id)
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    const patient = await PatientRepository.findByUserId(req.utilisateur.id);
    if (!patient) return res.status(404).json({ error: "Patient non trouvé" });
    const prescriptions = await PrescriptionRepository.findActiveByPatient(
      patient._id
    );
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
