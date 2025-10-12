const Utilisateur = require('../models/Utilisateur');

class UtilisateurRepository {
  async create(dataUtilisateur) {
    const utilisateur = new Utilisateur(dataUtilisateur);
    return await utilisateur.save();
  }

  async findByEmail(email) {
    return await Utilisateur.findOne({ email });
  }

  async findById(id) {
    return await Utilisateur.findById(id);
  }

  async update(id, updates) {
    return await Utilisateur.findByIdAndUpdate(id, updates, { new: true });
  }

  async suspend(id) {
    return await this.update(id, { active: false });
  }

  async reactivate(id) {
    return await this.update(id, { active: true });
  }
}

module.exports = new UtilisateurRepository();