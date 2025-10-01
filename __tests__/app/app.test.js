const request = require("supertest");
const app = require("../../app");
const db = require("../../funcs/db/connection");
const seed = require("../../funcs/db/seed");
const testData = require("../../db/data/test/index");

// beforeEach(() => {
//   seed(testData);
// });

afterAll(() => {
  db.end();
});

describe("app", () => {
  describe("general", () => {
    test.todo("404 - invalid path");
  });
  describe("GET /api/properties", () => {
    test("should respond with status 200", async () => {
      await request(app).get("/api/properties").expect(200);
    });
    test("response is properties object", async () => {
      const { body } = await request(app).get("/api/properties");
      expect(body).toHaveProperty("properties");
    });
    test("response of properties is correct length", async () => {
      const { body } = await request(app).get("/api/properties");
      expect(body.properties.length).toBe(11);
    });
    test.todo("response of properties is sorted by most to least favourite");
  });
});
