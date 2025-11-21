const request = require("supertest");
const app = require("../src/app");
const { expect } = require("chai");

describe("Patient API", () => {
  it("GET /api/v1/patients doit retourner 200, 401 ou 403", async () => {
    const res = await request(app).get("/api/v1/patients");
    expect(res.status).to.be.oneOf([200, 401, 403]);
  });
});
