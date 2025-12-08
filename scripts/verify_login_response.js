
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../src/app'); // Adjust path as needed
const Utilisateur = require('../src/models/Utilisateur');
const Patient = require('../src/models/Patient');
const Role = require('../src/models/Role');
const bcrypt = require('bcrypt');

async function testLogin() {
  try {
    // 1. Setup DB connection (assuming local mongo or mock, but let's try to connect to the app's DB if possible, or mock it)
    // Actually, running a full integration test might be complex if DB isn't running.
    // Let's assume the user has the app running or we can start it.
    // However, `app.js` exports `app`.
    
    // For this environment, I'll rely on the existing DB connection in app.js if start() is called, 
    // but `app.js` automatically connects when `start()` is not called explicitly! 
    // Wait, app.js exports `app` and has `start` function but doesn't call it if imported?
    // Line 63: `const startPromise = start().catch(...)`
    // It DOES call start() immediately! 
    // And `app.ready` is the promise.
    
    await app.ready; // Wait for DB connection
    
    // 2. Create a test patient user
    const email = `test_patient_${Date.now()}@test.com`;
    const password = 'password123';
    
    // Check/Create Role
    let role = await Role.findOne({ nom: 'patient' });
    if (!role) {
        role = await Role.create({ nom: 'patient' });
    }

    // Create User
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await Utilisateur.create({
      nom: 'Test',
      prenom: 'Mann',
      email: email,
      password: hashedPassword,
      role: role._id,
      active: true,
    });
    
    // Create Patient profile
    const patient = await Patient.create({
      utilisateur: user._id,
      nom: 'Test',
      prenom: 'Mann',
      email: email,
    });
    
    // Link patient to user
    user.patient = patient._id;
    await user.save();
    
    console.log(`Created test user: ${email} with patient ID: ${patient._id}`);

    // 3. Perform Login
    const res = await request(app)
      .post('/api/v1/connexion') // Check route path in authRoutes: router.post("/connexion", ...) mounted at /api/v1/
      // Wait, app.js: app.use("/api/v1/", authRoutes); -> So it's /api/v1/connexion
      .send({
        email: email,
        motDePasse: password
      });

    console.log('Login Response Status:', res.status);
    console.log('Login Response Body:', res.body);

    if (res.status === 200 && res.body.utilisateur && res.body.utilisateur.patient) {
        if (res.body.utilisateur.patient.toString() === patient._id.toString()) {
            console.log('SUCCESS: Patient ID returned in login response!');
        } else {
             console.log('FAILURE: Patient ID mismatch.');
        }
    } else {
        console.log('FAILURE: Patient ID missing or login failed.');
    }

    // Cleanup
    await Patient.deleteOne({ _id: patient._id });
    await Utilisateur.deleteOne({ _id: user._id });
    
    process.exit(0);

  } catch (error) {
    console.error('Test Error:', error);
    process.exit(1);
  }
}

testLogin();
