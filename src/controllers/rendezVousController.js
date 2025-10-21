const RendezVousRepository = require("../repositories/RendezVousRepository");
const Joi = require("joi");

const rendezVousSchema = Joi.object({
  date: Joi.date().required(),
  duree: Joi.number().min(1).max(480).required(),
  patient: Joi.string().required(),
});

const updateSchema = Joi.object({
  date: Joi.date().optional(),
  duree: Joi.number().min(1).max(480).optional(),
  statut: Joi.string().valid("confirmé", "annulé", "en attente").optional(),
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
      return res.status(409).json({
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

exports.updateRendezVous = async (req, res) => {
  const { error } = updateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const rdv = await RendezVousRepository.findById(req.params.id);
    if (!rdv) return res.status(404).json({ error: "Rendez-vous non trouvé" });

    if (req.body.date || req.body.duree) {
      const date = req.body.date || rdv.date;
      const duree = req.body.duree || rdv.duree;
      const conflits = await RendezVousRepository.findConflicts(
        date,
        duree,
        rdv.medecin
      );
      
      const conflitsFiltres = conflits.filter(
        (c) => c._id.toString() !== rdv._id.toString()
      );
      if (conflitsFiltres.length > 0) {
        return res
          .status(409)
          .json({ error: "Conflit : ce créneau est déjà réservé." });
      }
    }
    
    Object.assign(rdv, req.body);
    await rdv.save();
    res.json(rdv);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteRendezVous = async (req, res) => {
  try {
    const rdv = await RendezVousRepository.findById(req.params.id);
    if (!rdv) return res.status(404).json({ error: "Rendez-vous non trouvé" });
    rdv.statut = "annulé";
    await rdv.save();
    res.json({ message: "Rendez-vous annulé" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
