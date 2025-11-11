const LabOrderRepository = require("../repositories/LabOrderRepository");
const PatientRepository = require("../repositories/PatientRepository");
const Joi = require("joi");

const testSchema = Joi.object({
  code: Joi.string().optional(),
  nom: Joi.string().required(),
  instructions: Joi.string().optional(),
});

const createSchema = Joi.object({
  patient: Joi.string().required(),
  consultation: Joi.string().optional(),
  tests: Joi.array().items(testSchema).min(1).required(),
});

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

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getByPatient = async (req, res) => {
  try {
    const orders = await LabOrderRepository.findByPatient(req.params.patientId);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const order = await LabOrderRepository.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Ordre non trouvé" });
    res.json(order);
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
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
