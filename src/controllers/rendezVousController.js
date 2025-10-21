const RendezVousRepository = require("../repositories/RendezVousRepository");
const Joi = require("joi");

const rendezVousSchema = Joi.object({
  date: Joi.date().required(),
  duree: Joi.number().min(1).max(480).required(),
  patient: Joi.string().required(),
});

exports.createRendezVous = async (req, res) => {
  const medecinId = req.utilisateur.id;
  const { error } = rendezVousSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const { date, duree, patient } = req.body;
    const conflits = await RendezVousRepository.findConflicts(
      date,
      duree,
      medecinId
    );
    if (conflits.length > 0) {
      return res
        .status(409)
        .json({
          error: "Conflit : un rendez-vous existe déjà pour ce créneau.",
        });
    }
    const rendezVous = await RendezVousRepository.create({
      date,
      duree,
      patient,
      medecin: medecinId,
      statut: "confirmé",
    });
    res.status(201).json(rendezVous);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
