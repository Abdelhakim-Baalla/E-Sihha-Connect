const Role = require("../models/Role");

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

const jwt = require("jsonwebtoken");

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

const Patient = require("../models/Patient");
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
