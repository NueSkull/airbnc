const request = require("supertest");
const app = require("../../app");
const db = require("../../db/connection");
const seed = require("../../db/seeding/seed");
const {
  propertyTypesData,
  usersData,
  propertiesData,
  reviewsData,
  imagesData,
  favouritesData,
  bookingsData,
} = require("../../db/data/test/index");

beforeEach(async () => {
  await seed(
    propertyTypesData,
    usersData,
    propertiesData,
    reviewsData,
    imagesData,
    favouritesData,
    bookingsData
  );
});

afterAll(() => {
  db.end();
});

describe("app", () => {
  describe("general", () => {
    test.todo("404 - invalid path");
    test.todo("post method");
  });
  describe("GET /api/properties", () => {
    test("should respond with status 200", async () => {
      await request(app).get("/api/properties").expect(200);
    });
    test("response is array of properties", async () => {
      const { body } = await request(app).get("/api/properties");
      expect(Array.isArray(body.properties)).toBe(true);
    });
    test("response is has property of properties", async () => {
      const { body } = await request(app).get("/api/properties");
      expect(Array.isArray(body.properties)).toBe(true);
      expect(body).toHaveProperty("properties");
    });
    test("response of properties is correct length", async () => {
      const { body } = await request(app).get("/api/properties");
      expect(body.properties.length).toBe(11);
    });
    test.todo("response of properties is sorted by most to least favourite");
  });
});
