const UtilisateurDepot = require('../repositories/UtilisateurRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const schemaInscription = Joi.object({
    courriel: Joi.string().email().required(),
    motDePasse: Joi.string().min(6).required(),
    nom: Joi.string().required(),
    prenom: Joi.string().required(),
    // Ajoutez d'autres attributs si nécessaire
});

exports.inscription = async (req, res) => {
    const { error } = schemaInscription.validate(req.body);
    if (error) return res.status(400).json(error.details[0].message);
    const { courriel, motDePasse, nom, prenom } = req.body;
    const existant = await UtilisateurDepot.findByEmail(courriel);
    if (existant) return res.status(409).json('Le courriel existe déjà');
    const utilisateur = await UtilisateurDepot.create({ email: courriel, password: motDePasse, nom, prenom });
    res.status(201).json('Inscription réussie');
};

exports.connexion = async (req, res) => {
    const { courriel, motDePasse } = req.body;
    const utilisateur = await UtilisateurDepot.findByEmail(courriel);
    if (!utilisateur || !await utilisateur.comparePassword(motDePasse)) return res.status(401).json('Informations incorrectes');
    const jetonAcces = jwt.sign({ id: utilisateur._id, role: utilisateur.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const jetonRafraichissement = jwt.sign({ id: utilisateur._id }, process.env.REFRESH_SECRET, { expiresIn: '7d' });
    utilisateur.refreshToken = jetonRafraichissement;
    await utilisateur.save();
    res.json({ jetonAcces, jetonRafraichissement });
};