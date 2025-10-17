const Role = require("../models/Role");

async function seedRoles() {
  try {
    const rolesToEnsure = ["superadmin", "admin", "patient", "medecin", "infirmier", "secretaire"];

    for (const nom of rolesToEnsure) {
      const existing = await Role.findOne({ nom });
      if (!existing) {
        await Role.create({ nom });
        console.log(`Role créé: ${nom}`);
      } else {
        console.log(`Role existant: ${nom}`);
      }
    }

    console.log("Seed des roles terminé");
  } catch (err) {
    console.error("Erreur lors du seeding des roles:", err);
  }
}

module.exports = { seedRoles };
