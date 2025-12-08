
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const { seedRoles } = require('../src/seeders/roleSeeder');
const Role = require('../src/models/Role');
const Utilisateur = require('../src/models/Utilisateur');
const Patient = require('../src/models/Patient');
const Prescription = require('../src/models/Prescription');
const prescriptionController = require('../src/controllers/prescriptionController');

// Mock Req/Res
const mockReq = (user) => ({
  utilisateur: user,
  params: {},
  body: {}
});
const mockRes = () => {
  const res = {};
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (data) => { res.body = data; return res; };
  return res;
};

async function verifyPharmacist() {
  try {
    console.log('Connecting to DB...');
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('Seeding Roles...');
    await seedRoles();
    
    // Get Roles
    const rolePharmacien = await Role.findOne({ nom: 'pharmacien' });
    const roleMedecin = await Role.findOne({ nom: 'medecin' });
    const rolePatient = await Role.findOne({ nom: 'patient' });
    
    if (!rolePharmacien) throw new Error('Pharmacist role not found!');
    
    // Create Actors
    const pharmacistEmail = `pharma_${Date.now()}@test.com`;
    const pharmacist = await Utilisateur.create({
      nom: 'Pharma', prenom: 'Test', email: pharmacistEmail, password: 'pass', role: rolePharmacien._id, active: true
    });
    
    const doctorEmail = `doc_${Date.now()}@test.com`;
    const doctor = await Utilisateur.create({
      nom: 'Doc', prenom: 'Test', email: doctorEmail, password: 'pass', role: roleMedecin._id, active: true
    });
    
    const patientEmail = `pat_${Date.now()}@test.com`;
    const patientUser = await Utilisateur.create({
        nom: 'Pat', prenom: 'Test', email: patientEmail, password: 'pass', role: rolePatient._id, active: true
    });
    const patient = await Patient.create({ utilisateur: patientUser._id, nom: 'Pat', prenom: 'Test', email: patientEmail });

    console.log(`Created Pharmacist: ${pharmacist._id}`);
    
    // Create Prescription assigned to Pharmacist
    const prescription = await Prescription.create({
      patient: patient._id,
      medecin: doctor._id,
      pharmacien: pharmacist._id, // Assign here
      medicaments: [{ nom: 'Doliprane', dosage: '1000mg', voie: 'orale', frequence: '3x/j', duree: '3j' }],
      statut: 'sent'
    });
    console.log(`Created Prescription: ${prescription._id} assigned to ${pharmacist._id}`);
    
    // Test Controller
    console.log('Testing getAssignedPrescriptions...');
    const req = mockReq({ id: pharmacist._id, role: rolePharmacien._id });
    const res = mockRes();
    
    await prescriptionController.getAssignedPrescriptions(req, res);
    
    // Verify
    const results = res.body;
    console.log(`Found ${results.length} prescriptions.`);
    
    if (results.length > 0 && results[0]._id.toString() === prescription._id.toString()) {
        console.log('SUCCESS: Pharmacist retrieved assigned prescription.');
    } else {
        console.error('FAILURE: Prescription not retrieved.');
        console.log('Results:', results);
    }
    
    // Cleanup
    await Prescription.deleteOne({ _id: prescription._id });
    await Patient.deleteOne({ _id: patient._id });
    await Utilisateur.deleteOne({ _id: pharmacist._id });
    await Utilisateur.deleteOne({ _id: doctor._id });
    await Utilisateur.deleteOne({ _id: patientUser._id });
    
    process.exit(0);

  } catch (err) {
    console.error('Test Failed:', err);
    process.exit(1);
  }
}

verifyPharmacist();
