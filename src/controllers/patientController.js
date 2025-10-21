const PatientRepository = require("../repositories/PatientRepository");
const Joi = require("joi");

const patientSchema = Joi.object({
  nom: Joi.string().required(),
  prenom: Joi.string().required(),
  date_naissance: Joi.date().optional(),
  sexe: Joi.string().valid("Homme", "Femme").optional(),
  email: Joi.string().email().optional(),
  telephone: Joi.string().optional(),
  adresse: Joi.string().optional(),
  allergies: Joi.array().items(Joi.string()).optional(),
  medicalHistoriques: Joi.array().items(Joi.string()).optional(),
});

exports.createPatient = async (req, res) => {
  const { error } = patientSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const patient = await PatientRepository.create(req.body);
    res.status(201).json(patient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPatients = async (req, res) => {
  try {
    const patients = await PatientRepository.findAll(req.query);
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPatientById = async (req, res) => {
  try {
    const patient = await PatientRepository.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: "Patient non trouvé" });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePatient = async (req, res) => {
  const updateSchema = Joi.object({
    nom: Joi.string().optional(),
    prenom: Joi.string().optional(),
    date_naissance: Joi.date().optional(),
    sexe: Joi.string().valid("Homme", "Femme").optional(),
    email: Joi.string().email().optional(),
    telephone: Joi.string().optional(),
    adresse: Joi.string().optional(),
    allergies: Joi.array()
      .items(Joi.string().regex(/^[a-fA-F0-9]{24}$/))
      .optional(),
    medicalHistoriques: Joi.array()
      .items(Joi.string().regex(/^[a-fA-F0-9]{24}$/))
      .optional(),
  });
  const { error } = updateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const patient = await PatientRepository.update(req.params.id, req.body);
    if (!patient) return res.status(404).json({ error: "Patient non trouvé" });
    res.json(patient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    const patient = await PatientRepository.delete(req.params.id);
    if (!patient) return res.status(404).json({ error: "Patient non trouvé" });
    res.json({ message: "Patient supprimé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
