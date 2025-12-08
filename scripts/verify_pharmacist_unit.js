
const assert = require('assert');
const prescriptionController = require('../src/controllers/prescriptionController');
const PrescriptionRepository = require('../src/repositories/PrescriptionRepository');

// Mock Data
const mockPrescriptions = [
  { _id: 'presc1', patient: { nom: 'Pat1' }, medecin: { nom: 'Doc1' }, pharmacien: 'pharma1' },
  { _id: 'presc2', patient: { nom: 'Pat2' }, medecin: { nom: 'Doc1' }, pharmacien: 'pharma1' }
];

// Mock Repository
PrescriptionRepository.findByPharmacist = async (id) => {
  return mockPrescriptions.filter(p => p.pharmacien === id);
};

// Mock Req/Res
const mockReq = (userId) => ({
  utilisateur: { id: userId },
  params: {},
  body: {}
});
const mockRes = () => {
  const res = {};
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (data) => { res.body = data; return res; };
  return res;
};

async function testGetAssignedPrescriptions() {
  console.log('Testing getAssignedPrescriptions UNIT...');
  
  const req = mockReq('pharma1');
  const res = mockRes();
  
  await prescriptionController.getAssignedPrescriptions(req, res);
  
  console.log('Response Body:', res.body);
  
  if (res.body && res.body.length === 2) {
      console.log('SUCCESS: Retrieved 2 assigned prescriptions.');
  } else {
      console.error('FAILURE: Expected 2 prescriptions.');
      process.exit(1);
  }
  
  // Test with wrong ID
  const req2 = mockReq('other');
  const res2 = mockRes();
  await prescriptionController.getAssignedPrescriptions(req2, res2);
  
  if (res2.body && res2.body.length === 0) {
      console.log('SUCCESS: Retrieved 0 prescriptions for other user.');
  } else {
      console.error('FAILURE: Expected 0 prescriptions for other user.');
      process.exit(1);
  }
  
  process.exit(0);
}

testGetAssignedPrescriptions().catch(err => {
  console.error(err);
  process.exit(1);
});
