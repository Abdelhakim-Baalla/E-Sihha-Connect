const UtilisateurDepot = require("../repositories/UtilisateurRepository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const crypto = require("crypto");
const emailSen = require("../utils/EnvoyerEmail");

const schemaInscription = Joi.object({
  nom: Joi.string().required(),
  prenom: Joi.string().required(),
  specialite: Joi.string().optional(),
  email: Joi.string().email().required(),
  motDePasse: Joi.string().min(6).required(),
});

const schemaMotDePasseOublie = Joi.object({
  email: Joi.string().email().required(),
});

const schemaResetMotDePasse = Joi.object({
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

exports.forgetPassword = async (req, res) => {
  try {
    const { error } = schemaMotDePasseOublie.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Données invalides",
        erreur: error.details[0].message,
      });
    }

    const { email } = req.body;
    const user = await UtilisateurDepot.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000;
    await user.save();

    await emailSen.envoyerEmail(user, resetToken);

    res.status(200).json({
      message: "Email de réinitialisation envoyé avec succès",
    });
  } catch (error) {
    console.error("Erreur mot de passe oublié:", error);
    res.status(500).json({
      message: "Erreur serveur lors de l'envoi de l'email",
      erreur: error.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { error } = schemaResetMotDePasse.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Mot de passe invalide",
        erreur: error.details[0].message,
      });
    }

    const { token } = req.params;
    const { motDePasse } = req.body;

    const user = await UtilisateurDepot.findByResetToken(token);
    if (!user) {
      return res.status(400).json({
        message: "Token invalide ou expiré",
      });
    }

    user.password = motDePasse;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({
      message: "Mot de passe réinitialisé avec succès",
    });
  } catch (error) {
    console.error("Erreur reset mot de passe:", error);
    res.status(500).json({
      message: "Erreur serveur lors de la réinitialisation",
      erreur: error.message,
    });
  }
};
