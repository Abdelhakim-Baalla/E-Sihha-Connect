const request = require("supertest");
const app = require("../src/app");
const { expect } = require("chai");

describe("Availability API", () => {
  it("GET /api/v1/availability doit retourner 200 ou 403", async () => {
    const res = await request(app).get("/api/v1/availability");
    expect(res.status).to.be.oneOf([200, 403]);
  });
});
