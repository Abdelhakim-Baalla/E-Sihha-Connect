
const assert = require('assert');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock helpers
const mockReq = (body) => ({ body });
const mockRes = () => {
  const res = {};
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (data) => { res.body = data; return res; };
  return res;
};

// Start
async function testConnexion() {
  console.log('Starting Unit Test for authController.connexion...');

  // Mock Env
  process.env.JWT_SECRET = 'test_secret';
  process.env.REFRESH_SECRET = 'test_refresh_secret';

  // Load Controller
  // Note: This loads Repositories/Models. As long as they don't auto-connect, we are good.
  const authController = require('../src/controllers/authController');
  const UtilisateurDepot = require('../src/repositories/UtilisateurRepository');

  // Mock Data
  const mockUser = {
    _id: 'user123',
    email: 'test@test.com',
    password: 'hashed_password',
    nom: 'Test',
    prenom: 'User',
    active: true,
    role: 'role123',
    patient: 'patient123',
    save: async () => {}, // Mock save()
  };

  // Mock Repository
  UtilisateurDepot.findByEmail = async (email) => {
    if (email === mockUser.email) return mockUser;
    return null;
  };

  // Mock Bcrypt
  // We can't easily mock bcrypt.compare if it's required inside controller unless we use a mocking lib like proxyquire.
  // BUT, we can just set the password implementation to something that bcrypt.compare (real) matches.
  // OR we can hope that we can spy on it.
  // Actually, let's just use real bcrypt and hash the password.
  mockUser.password = await bcrypt.hash('password123', 10);

  // Execute
  const req = mockReq({ email: 'test@test.com', motDePasse: 'password123' });
  const res = mockRes();

  await authController.connexion(req, res);

  // Verify
  console.log('Response Body:', res.body);

  if (!res.body) {
    console.error('FAILED: No response body');
    process.exit(1);
  }

  if (!res.body.utilisateur) {
    console.error('FAILED: No utilisateur in response');
    process.exit(1);
  }

  if (res.body.utilisateur.patient !== 'patient123') {
    console.error('FAILED: Patient ID mismatch');
    console.error('Expected: patient123');
    console.error('Actual:', res.body.utilisateur.patient);
    process.exit(1);
  }

  console.log('SUCCESS: Patient ID returned correctly!');
  process.exit(0);
}

testConnexion().catch(err => {
  console.error('Test Error:', err);
  process.exit(1);
});
