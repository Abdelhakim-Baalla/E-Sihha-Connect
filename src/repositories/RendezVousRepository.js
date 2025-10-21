const RendezVous = require("../models/RendezVous");

class RendezVousRepository {
  async create(data) {
    const rendezVous = new RendezVous(data);
    return await rendezVous.save();
  }

  async findConflicts(date, duree, medecinId) {
    const start = new Date(date);
    const end = new Date(start.getTime() + duree * 60000);
    return await RendezVous.find({
      medecin: medecinId,
      $or: [
        {
          date: { $lt: end },
          $expr: {
            $gte: [
              { $add: ["$date", { $multiply: ["$duree", 60000] }] },
              start,
            ],
          },
        },
        { date: { $gte: start, $lt: end } },
      ],
      statut: { $ne: "annulé" },
    });
  }

  async checkConflicts(date, duree, medecinId, excludeId = null) {
    const start = new Date(date);
    const end = new Date(start.getTime() + duree * 60000);
    const query = {
      medecin: medecinId,
      date: { $lt: end },
      statut: { $ne: "annulé" },
    };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const rdvs = await RendezVous.find(query);
    
    return rdvs.filter((rdv) => {
      const rdvStart = rdv.date;
      const rdvEnd = new Date(rdv.date.getTime() + rdv.duree * 60000);
      return start < rdvEnd && end > rdvStart;
    });
  }

  async findById(id) {
    return await RendezVous.findById(id)
      .populate("patient")
      .populate("medecin");
  }
}

module.exports = new RendezVousRepository();
