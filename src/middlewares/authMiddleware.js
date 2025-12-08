const Role = require("../models/Role");
const jwt = require("jsonwebtoken");
const Patient = require("../models/Patient");

exports.isDoctor = async (req, res, next) => {
  try {
    if (!req.utilisateur || !req.utilisateur.role) {
      return res.status(403).json("Accès refusé : rôle manquant");
    }
    const role = await Role.findById(req.utilisateur.role);
    if (!role || role.nom !== "medecin") {
      return res
        .status(403)
        .json("Accès refusé : seul un médecin peut consulter ce dossier");
    }
    next();
  } catch (err) {
    res
      .status(500)
      .json("Erreur serveur lors de la vérification du rôle doctor");
  }
};

exports.isLabResponsable = async (req, res, next) => {
  try {
    if (!req.utilisateur || !req.utilisateur.role) {
      return res.status(403).json("Accès refusé : rôle manquant");
    }
    const role = await Role.findById(req.utilisateur.role);
    if (!role || role.nom !== "responsable-labo") {
      return res
        .status(403)
        .json("Accès refusé : réservé aux responsables de laboratoire");
    }
    next();
  } catch (err) {
    res
      .status(500)
      .json(
        "Erreur serveur lors de la vérification du rôle responsable de laboratoire"
      );
  }
};

exports.isPharmacist = async (req, res, next) => {
  try {
    if (!req.utilisateur || !req.utilisateur.role) {
      return res.status(403).json("Accès refusé : rôle manquant");
    }
    const role = await Role.findById(req.utilisateur.role);
    if (!role || role.nom !== "pharmacien") {
      return res.status(403).json("Accès refusé : réservé aux pharmaciens");
    }
    next();
  } catch (err) {
    res
      .status(500)
      .json("Erreur serveur lors de la vérification du rôle pharmacien");
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    if (!req.utilisateur || !req.utilisateur.role) {
      return res.status(403).json("Accès refusé : rôle manquant");
    }
    const role = await Role.findById(req.utilisateur.role);
    if (!role || (role.nom !== "admin" && role.nom !== "superadmin")) {
      return res
        .status(403)
        .json(
          "Accès refusé : seul un administrateur peut effectuer cette action"
        );
    }
    next();
  } catch (err) {
    res
      .status(500)
      .json("Erreur serveur lors de la vérification du rôle admin");
  }
};

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json("Le token est manquant");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.utilisateur = decoded;
    next();
  } catch (err) {
    res.status(401).json("Le token est invalide ou a expiré");
  }
};

exports.isSelfPatient = async (req, res, next) => {
  try {
    if (!req.utilisateur) {
      return res.status(403).json("Accès refusé : utilisateur non authentifié");
    }
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json("Patient non trouvé");
    }
    if (patient.utilisateur.toString() !== req.utilisateur.id) {
      return res
        .status(403)
        .json("Accès refusé : vous ne pouvez modifier que votre propre profil");
    }
    next();
  } catch (err) {
    res.status(500).json("Erreur lors de la vérification du patient");
  }
};
