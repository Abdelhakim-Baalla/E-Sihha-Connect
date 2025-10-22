const RendezVous = require("../models/RendezVous");
const Joi = require("joi");

exports.getAvailability = async (req, res) => {
  const schema = Joi.object({
    doctorId: Joi.string().required(),
    date: Joi.date().required(),
  });
  const { error } = schema.validate(req.query);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const { doctorId, date } = req.query;
    const startDay = new Date(date);
    startDay.setHours(0, 0, 0, 0);
    const endDay = new Date(date);
    endDay.setHours(23, 59, 59, 999);
    const rdvs = await RendezVous.find({
      medecin: doctorId,
      date: { $gte: startDay, $lte: endDay },
      statut: { $ne: "annulé" },
    });
    
    const slots = rdvs.map((rdv) => ({
      start: rdv.date,
      end: new Date(rdv.date.getTime() + rdv.duree * 60000),
    }));
    res.json({ slots });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
