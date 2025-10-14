const UtilisateurDepot = require("../repositories/UtilisateurRepository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const schemaInscription = Joi.object({
  nom: Joi.string().required(),
  prenom: Joi.string().required(),
  specialite: Joi.string().optional(),
  email: Joi.string().email().required(),
  motDePasse: Joi.string().min(6).required(),
});

exports.inscription = async (req, res) => {
  const { error } = schemaInscription.validate(req.body);
  if (error) {
    return res.status(400).json(error.details[0].message);
  }
  try {
    const { email, motDePasse, nom, prenom, spécialite } = req.body;
    const existant = await UtilisateurDepot.findByEmail(email);
    if (existant) return res.status(409).json("Le email existe déjà");
    const utilisateur = await UtilisateurDepot.create({
      email: email,
      password: motDePasse,
      nom,
      prenom,
      specialite: spécialite,
    });
    res.status(201).json("Inscription réussie");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur: " + err.message);
  }
};

exports.connexion = async (req, res) => {
  const { email, motDePasse } = req.body;
  const utilisateur = await UtilisateurDepot.findByEmail(email);
  if (!utilisateur) {
    return res.status(401).json("Informations incorrectes");
  }
  const motDePasseValide = await bcrypt.compare(
    motDePasse,
    utilisateur.password
  );
  if (!motDePasseValide) {
    return res.status(401).json("Informations incorrectes");
  }
  if (!utilisateur.active) {
    return res.status(403).json("Compte inactif");
  }

  const jetonAcces = jwt.sign(
    { id: utilisateur._id, role: utilisateur.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
  const jetonRafraichissement = jwt.sign(
    { id: utilisateur._id },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  utilisateur.refreshToken = jetonRafraichissement;
  utilisateur.accessToken = jetonAcces;
  await utilisateur.save();

  res.json({ jetonAcces, jetonRafraichissement });
};
