const ConsultationRepository = require("../repositories/ConsultationRepository");
const PatientRepository = require("../repositories/PatientRepository");
const RendezVousRepository = require("../repositories/RendezVousRepository");
const Joi = require("joi");

const createSchema = Joi.object({
  patient: Joi.string().required(),
  rendezVous: Joi.string().optional(),
  temperature: Joi.number().optional(),
  tension_systolique: Joi.number().optional(),
  tension_diastolique: Joi.number().optional(),
  frequence_cardiaque: Joi.number().optional(),
  frequence_respiratoire: Joi.number().optional(),
  poids: Joi.number().optional(),
  taille: Joi.number().optional(),
  observations: Joi.string().optional(),
});

exports.createConsultation = async (req, res) => {
  const medecinId = req.utilisateur && req.utilisateur.id;
  if (!medecinId) return res.status(403).json({ error: "Accès refusé" });

  const { error } = createSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const {
      patient,
      rendezVous,
      temperature,
      tension_systolique,
      tension_diastolique,
      frequence_cardiaque,
      frequence_respiratoire,
      poids,
      taille,
      observations,
    } = req.body;

    const patientDoc = await PatientRepository.findById(patient);
    if (!patientDoc)
      return res.status(404).json({ error: "Patient non trouvé" });

    let rdvDoc = null;
    if (rendezVous) {
      rdvDoc = await RendezVousRepository.findById(rendezVous);
      if (!rdvDoc)
        return res.status(404).json({ error: "Rendez-vous non trouvé" });
    }

    const consultation = await ConsultationRepository.create({
      patient,
      medecin: medecinId,
      rendezVous: rendezVous || undefined,
      temperature,
      tension_systolique,
      tension_diastolique,
      frequence_cardiaque,
      frequence_respiratoire,
      poids,
      taille,
      observations,
    });

    res.status(201).json(consultation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getByPatient = async (req, res) => {
  try {
    const consultations = await ConsultationRepository.findByPatient(
      req.params.patientId
    );
    res.json(consultations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
