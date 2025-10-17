const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db");
const { seedRoles } = require("./seeders/roleSeeder");
const {seedUtilisateurs} = require("./seeders/utilisateurSeeder");

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/v1/", authRoutes);

app.get("/", (req, res) => {
  res.send("Bienvenue sur E-Sihha Connect API");
});

const PORT = process.env.PORT || 3000;

async function start() {
  await connectDB();
  await seedRoles();
  await seedUtilisateurs();

  app.listen(PORT, () =>
    console.log(`Le serveur fonctionne sur le port ${PORT}`)
  );
}

start().catch((err) => {
  console.error("Erreur au démarrage de l'application:", err);
  process.exit(1);
});
