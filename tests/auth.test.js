const request = require("supertest");
const app = require("../src/app");
const { expect } = require("chai");

describe("Auth API", () => {
  it("POST /api/v1/inscription doit créer un utilisateur", async () => {
    const res = await request(app)
      .post("/api/v1/inscription")
      .send({ email: "testuser@example.com", password: "motdepasse" });
    expect(res.status).to.be.oneOf([201, 400]); // 201 si succès, 400 si déjà existant
  });

  it("POST /api/v1/connexion doit retourner un token ou 401", async () => {
    const res = await request(app)
      .post("/api/v1/connexion")
      .send({ email: "testuser@example.com", password: "motdepasse" });
    expect(res.status).to.be.oneOf([200, 401]);
  });
});
