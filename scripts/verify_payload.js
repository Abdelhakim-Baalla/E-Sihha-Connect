
const assert = require('assert');
const prescriptionController = require('../src/controllers/prescriptionController');
const PrescriptionRepository = require('../src/repositories/PrescriptionRepository');

// Mock Data
const mockPrescription = {
  _id: 'presc1',
  medecin: { _id: 'doc1', toString: () => 'doc1' },
  pharmacien: { toString: () => 'pharma1' },
  patient: { 
      // Emulating a populated patient object
      nom: 'Dupont',
      prenom: 'Jean',
      utilisateur: { toString: () => 'userPat1' }, // Needed for access control check in controller
      date_naissance: new Date()
  },
  medicaments: [
      { nom: 'Doliprane', dosage: '1000mg' }
  ]
};

// Mock Repository
PrescriptionRepository.findById = async (id) => {
  if (id === 'presc1') return mockPrescription;
  return null;
};

// Mock Req/Res
const mockReq = (userId) => ({
  utilisateur: { id: userId },
  params: { id: 'presc1' },
  body: {}
});
const mockRes = () => {
  const res = {};
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (data) => { res.body = data; return res; };
  return res;
};

async function verifyPayload() {
  console.log('Testing Detail Payload...');

  const req = mockReq('pharma1'); // Pharmacist requesting
  const res = mockRes();
  
  await prescriptionController.getById(req, res);
  
  const body = res.body;
  console.log('Response Body:', JSON.stringify(body, null, 2));

  // Assertions
  assert.strictEqual(body.patient.nom, 'Dupont', 'Patient Name missing');
  assert.strictEqual(body.patient.prenom, 'Jean', 'Patient Surname missing');
  assert.strictEqual(body.medicaments[0].nom, 'Doliprane', 'Medication Name missing');
  assert.strictEqual(body.medicaments[0].dosage, '1000mg', 'Dosage missing');
  
  console.log('SUCCESS: Payload contains all required details.');
}

verifyPayload().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});
