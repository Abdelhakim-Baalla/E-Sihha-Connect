const request = require("supertest");
const app = require("../src/app");
const { expect } = require("chai");

describe("RendezVous API", () => {
  it("GET /api/v1/rendezvous/check-conflicts doit retourner 200 ou 403", async () => {
    const res = await request(app).get("/api/v1/rendezvous/check-conflicts");
    expect(res.status).to.be.oneOf([200, 403]);
  });
});
