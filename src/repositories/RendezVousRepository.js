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

  async findById(id) {
    return await RendezVous.findById(id)
      .populate("patient")
      .populate("medecin");
  }
}

module.exports = new RendezVousRepository();
