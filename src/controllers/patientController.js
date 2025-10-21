const PatientRepository = require("../repositories/PatientRepository");
const Joi = require("joi");
const UtilisateurDepot = require("../repositories/UtilisateurRepository");
const Role = require("../models/Role");
const Patient = require("../models/Patient");

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
    const existant = await UtilisateurDepot.findByEmail(req.body.email);
    if (existant) {
      return res
        .status(409)
        .json({ error: "Email déjà utilisé par un utilisateur." });
    }

    let rolePatient = await Role.findOne({ nom: "patient" });
    if (!rolePatient) {
      rolePatient = await Role.create({ nom: "patient" });
    }

    const motDePasse = req.body.motDePasse || Math.random().toString(36).slice(-8);

    const utilisateur = await UtilisateurDepot.create({
      nom: req.body.nom,
      prenom: req.body.prenom,
      email: req.body.email,
      password: motDePasse,
      role: rolePatient._id,
      active: true,
    });

    const patient = await Patient.create({
      utilisateur: utilisateur._id,
      nom: req.body.nom,
      prenom: req.body.prenom,
      date_naissance: req.body.date_naissance,
      sexe: req.body.sexe,
      email: req.body.email,
      telephone: req.body.telephone,
      adresse: req.body.adresse,
      allergies: req.body.allergies,
      medicalHistoriques: req.body.medicalHistoriques,
    });

    utilisateur.patient = patient._id;
    await utilisateur.save();

    res.status(201).json({ patient, utilisateur });
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
