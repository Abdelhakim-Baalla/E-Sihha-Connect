
const assert = require('assert');
const prescriptionController = require('../src/controllers/prescriptionController');
const PrescriptionRepository = require('../src/repositories/PrescriptionRepository');

// Mock Data
const mockPrescription = {
  _id: 'presc1',
  medecin: { _id: 'doc1', toString: () => 'doc1' },
  pharmacien: { toString: () => 'pharma1' }, // Assuming simple ID or object with toString
  patient: { 
      utilisateur: { toString: () => 'userPat1' } 
  }
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

async function testGetByIdSecurity() {
  console.log('Testing getById Security...');

  // 1. Test Doctor Access
  let req = mockReq('doc1');
  let res = mockRes();
  await prescriptionController.getById(req, res);
  assert.strictEqual(res.body, mockPrescription, 'Doctor should access');

  // 2. Test Pharmacist Access
  req = mockReq('pharma1');
  res = mockRes();
  await prescriptionController.getById(req, res);
  assert.strictEqual(res.body, mockPrescription, 'Pharmacist should access');

  // 3. Test Patient Access
  req = mockReq('userPat1');
  res = mockRes();
  await prescriptionController.getById(req, res);
  assert.strictEqual(res.body, mockPrescription, 'Patient should access');

  // 4. Test Unauthorized Access
  req = mockReq('hacker');
  res = mockRes();
  await prescriptionController.getById(req, res);
  assert.strictEqual(res.statusCode, 403, 'Hacker should be denied');

  console.log('SUCCESS: All security checks passed.');
}

testGetByIdSecurity().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});
