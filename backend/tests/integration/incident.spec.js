const request = require("supertest");

const app = require("../../src/app");
const connection = require("../../src/database/connection");

describe("INCIDENTS", () => {
  beforeAll(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("should be insert a new Incident", async () => {
    const { body } = await request(app)
      .post("/ongs")
      .send({
        name: "ONG Test",
        email: "ong@ong.com",
        whatsapp: "0000000000",
        city: "Test City",
        uf: "TS"
      });

    const { id } = body;

    const response = await request(app)
      .post("/incidents")
      .set("Authorization", id)
      .send({
        title: "Incidents Test 1",
        description: "Description Incidents Test 1",
        value: 180
      });

    expect(response.body).toHaveProperty("id");
  });

  it("should be list all Incidents", async () => {
    const response = await request(app).get("/incidents");
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

});
