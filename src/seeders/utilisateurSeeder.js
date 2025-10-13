const Utilisateur = require("../models/Utilisateur");
const Role = require("../models/Role");

async function seedUtilisateurs() {
  try {
    const superAdminRole = await Role.findOne({ nom: "superadmin" });

    const utilisateursToEnsure = [
      { 
        email: "abdelhakimbaalla50@gmail.com", 
        password: "123456789", 
        role: superAdminRole ? superAdminRole._id : null, 
        nom: "Baalla", 
        prenom: "Abdelhakim", 
        specialite: "Developpeur" ,
        active: true,
        date_naissance: new Date("2006-06-28"),

      },
    ];

    for (const userData of utilisateursToEnsure) {
      const existing = await Utilisateur.findOne({ email: userData.email });
      if (!existing) {
        const newUser = new Utilisateur(utilisateursToEnsure[0]);
        await newUser.save();
        console.log(`Utilisateur créé: ${userData.email}`);
      } else {
        console.log(`Utilisateur existant: ${userData.email}`);
      }
    }

    console.log("Seed des utilisateurs terminé");
  } catch (err) {
    console.error("Erreur lors du seeding des utilisateurs:", err);
  }
}

module.exports = { seedUtilisateurs };