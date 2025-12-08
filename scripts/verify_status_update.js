
const assert = require('assert');
const prescriptionController = require('../src/controllers/prescriptionController');
const PrescriptionRepository = require('../src/repositories/PrescriptionRepository');
const Role = require('../src/models/Role'); // Needed for mocking

// Mock Data
const mockPrescription = {
  _id: 'presc1',
  medecin: { _id: 'doc1', toString: () => 'doc1' },
  pharmacien: { toString: () => 'pharma1' },
  statut: 'active'
};

const mockRolePharmacien = { _id: 'rolePharma', nom: 'pharmacien' };
const mockRoleDoctor = { _id: 'roleDocteur', nom: 'medecin' };

// Mock Repository
PrescriptionRepository.findById = async (id) => {
  if (id === 'presc1') return mockPrescription;
  return null;
};
PrescriptionRepository.updateStatus = async (id, statut) => {
    return { ...mockPrescription, statut }; // Return updated mock
};

// Mock Role Model
Role.findById = async (id) => {
    if (id === 'rolePharma') return mockRolePharmacien;
    if (id === 'roleDocteur') return mockRoleDoctor;
    return null;
};

// Mock Req/Res
const mockReq = (userId, roleId, body) => ({
  utilisateur: { id: userId, role: roleId },
  params: { id: 'presc1' },
  body: body
});
const mockRes = () => {
  const res = {};
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (data) => { res.body = data; return res; };
  return res;
};

async function verifyStatusUpdate() {
  console.log('Testing Status Update Logic...');

  // 1. Test Pharmacist Success (Dispensee)
  console.log('Test 1: Assigned Pharmacist -> Dispensée');
  let req = mockReq('pharma1', 'rolePharma', { statut: 'dispensee' });
  let res = mockRes();
  await prescriptionController.updateStatus(req, res);
  assert.strictEqual(res.body.statut, 'dispensee', 'Should update to dispensee');

  // 2. Test Pharmacist Fail (Other status)
  console.log('Test 2: Assigned Pharmacist -> Cancelled (Fail)');
  req = mockReq('pharma1', 'rolePharma', { statut: 'annulee' });
  res = mockRes();
  await prescriptionController.updateStatus(req, res);
  assert.strictEqual(res.statusCode, 403, 'Should deny non-dispensee status');

  // 3. Test Unassigned Pharmacist Fail
  console.log('Test 3: Unassigned Pharmacist -> Dispensée (Fail)');
  req = mockReq('pharma2', 'rolePharma', { statut: 'dispensee' });
  res = mockRes();
  await prescriptionController.updateStatus(req, res);
  assert.strictEqual(res.statusCode, 403, 'Should deny unassigned pharmacist');

  // 4. Test Doctor Success
  console.log('Test 4: Doctor -> Annulée');
  req = mockReq('doc1', 'roleDocteur', { statut: 'annulee' });
  res = mockRes();
  await prescriptionController.updateStatus(req, res);
  assert.strictEqual(res.body.statut, 'annulee', 'Doctor should be able to update');

  console.log('SUCCESS: All status update checks passed.');
}

verifyStatusUpdate().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});
