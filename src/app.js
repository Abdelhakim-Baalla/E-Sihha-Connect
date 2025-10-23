const bookRendezVousRoutes = require("./routes/bookRendezVousRoutes");
const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const rendezVousRoutes = require("./routes/rendezVousRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");
const consultationRoutes = require("./routes/consultationRoutes");
const connectDB = require("./config/db");
const { seedRoles } = require("./seeders/roleSeeder");
const { seedUtilisateurs } = require("./seeders/utilisateurSeeder");
require("./models/Allergie");
require("./models/MedicalHistorique");
require("./models/Utilisateur");
require("./models/Patient");
require("./models/RendezVous");
require("./models/Consultation");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/v1/", authRoutes);
app.use("/api/v1/patients", patientRoutes);
app.use("/api/v1/rendezvous", rendezVousRoutes);
app.use("/api/v1/rendezvous", bookRendezVousRoutes);
app.use("/api/v1/availability", availabilityRoutes);
app.use("/api/v1/consultations", consultationRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
