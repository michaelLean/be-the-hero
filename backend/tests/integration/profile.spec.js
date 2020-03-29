const request = require("supertest");

const app = require("../../src/app");
const connection = require("../../src/database/connection");

describe("PROFILE", () => {
  beforeAll(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("should be able to list all incidents of an ONG", async () => {
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

    await request(app)
      .post("/incidents")
      .set("Authorization", id)
      .send({
        title: "Incidents Test 1",
        description: "Description Incidents Test 1",
        value: 180
      });

    await request(app)
      .post("/incidents")
      .set("Authorization", id)
      .send({
        title: "Incidents Test 2",
        description: "Description Incidents Test 2",
        value: 180
      });

    await request(app)
      .post("/incidents")
      .set("Authorization", id)
      .send({
        title: "Incidents Test 3",
        description: "Description Incidents Test 3",
        value: 180
      });

    const response = await request(app)
      .get("/profile")
      .set("Authorization", id);
    expect(response.body.length).toBeGreaterThanOrEqual(3);
  });
});
