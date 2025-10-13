const UtilisateurDepot = require("../repositories/UtilisateurRepository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const schemaInscription = Joi.object({
  nom: Joi.string().required(),
  prenom: Joi.string().required(),
  spécialite: Joi.string().optional(),
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


