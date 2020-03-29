const request = require("supertest");

const app = require("../../src/app");
const connection = require("../../src/database/connection");

describe("SESSION", () => {
  beforeAll(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("should be able to authenicate an ONG", async () => {
    const { body } = await request(app)
      .post("/ongs")
      .send({
        name: "ONG Test",
        email: "ong@ong.com",
        whatsapp: "0000000000",
        city: "Test City",
        uf: "TS"
      });

    const response = await request(app)
      .post("/sessions")
      .send({
        id: body.id
      });

      expect(response.body).toHaveProperty("name");
      expect(response.body.name).toBe("ONG Test")
  });
});
