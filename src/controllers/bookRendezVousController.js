const RendezVousRepository = require("../repositories/RendezVousRepository");
const Joi = require("joi");
const Patient = require("../models/Patient");

const bookSchema = Joi.object({
  date: Joi.date().required(),
  duree: Joi.number().min(1).max(480).required(),
  medecin: Joi.string().required(),
});

exports.bookRendezVous = async (req, res) => {
  const utilisateurId = req.utilisateur.id;
  try {
    const patient = await Patient.findOne({ utilisateur: utilisateurId });
    if (!patient)
      return res
        .status(403)
        .json({ error: "Accès refusé : vous n'êtes pas un patient." });

    const { error } = bookSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const { date, duree, medecin } = req.body;
    const conflits = await RendezVousRepository.findConflicts(
      date,
      duree,
      medecin
    );
    if (conflits.length > 0) {
      return res
        .status(409)
        .json({ error: "Conflit : ce créneau est déjà réservé." });
    }
    const rendezVous = await RendezVousRepository.create({
      date,
      duree,
      patient: patient._id,
      medecin,
      statut: "en attente",
    });
    res.status(201).json(rendezVous);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
