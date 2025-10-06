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
    test("404 - invalid paths are handled", async () => {
      const { status, body } = await request(app).get("/api/fictionalpath");
      expect(status).toBe(404);
      expect(body.msg).toBe("Path not found");
    });
    test.todo("405 - incorrect method used on valid path");
  });
  describe("GET /api/properties", () => {
    test("should respond with status 200", async () => {
      await request(app).get("/api/properties").expect(200);
    });
    test("response is array of properties", async () => {
      const { body } = await request(app).get("/api/properties");
      expect(Array.isArray(body.properties)).toBe(true);
    });
    test("response has property of properties", async () => {
      const { body } = await request(app).get("/api/properties");
      expect(Array.isArray(body.properties)).toBe(true);
      expect(body).toHaveProperty("properties");
    });
    test("response of properties has length", async () => {
      const { body } = await request(app).get("/api/properties");
      expect(body.properties.length).toBeGreaterThan(0);
    });
    test("check property has property_id value", async () => {
      const { body } = await request(app).get("/api/properties");
      const singleProperty = body.properties[0];
      expect(singleProperty).toHaveProperty("property_id");
    });
    test("check property has property_name value", async () => {
      const { body } = await request(app).get("/api/properties");
      const singleProperty = body.properties[0];
      expect(singleProperty).toHaveProperty("property_name");
    });
    test("check property has location value", async () => {
      const { body } = await request(app).get("/api/properties");
      const singleProperty = body.properties[0];
      expect(singleProperty).toHaveProperty("location");
    });
    test("check property has price_per_night value", async () => {
      const { body } = await request(app).get("/api/properties");
      const singleProperty = body.properties[0];
      expect(singleProperty).toHaveProperty("price_per_night");
    });
    test("check property has host value", async () => {
      const { body } = await request(app).get("/api/properties");
      const singleProperty = body.properties[0];
      expect(singleProperty).toHaveProperty("host");
    });
    test("ensure host is full name", async () => {
      const { body } = await request(app).get("/api/properties");
      const firstPropertyHost = body.properties[0].host;
      expect(firstPropertyHost.indexOf(" ") > -1).toBe(true);
    });
    test.skip("response of properties is sorted by most to least favourite", async () => {
      const { body } = await request(app).get("/api/properties");
      const lengthOfResponses = body.properties.length - 1;
      console.log(body.properties[0].rating);
      console.log(body.properties[lengthOfResponses].rating);
      expect(
        body.properties[0].rating > body.properties[lengthOfResponses].rating
      ).toBe(true);
      // come back to this one, use the reviews API for comparison
    });
    test("when passed a maxprice query, returned properties do not exceed that price", async () => {
      const { body } = await request(app).get("/api/properties?maxprice=155");
      const maxCostPerNight = Math.max(
        ...body.properties.map((property) => {
          return property.price_per_night;
        })
      );
      expect(maxCostPerNight <= 155).toBe(true);
    });
    test("includes properties matching the max value", async () => {
      const { body } = await request(app).get("/api/properties?maxprice=150");
      const maxCostPerNight = Math.max(
        ...body.properties.map((property) => {
          return property.price_per_night;
        })
      );
      expect(maxCostPerNight === 150).toBe(true);
    });
    test("when passed a minprice query, returned properties do not fall below that price", async () => {
      const { body } = await request(app).get("/api/properties?minprice=155");
      const minCostPerNight = Math.min(
        ...body.properties.map((property) => {
          return property.price_per_night;
        })
      );
      expect(minCostPerNight >= 155).toBe(true);
    });
    test("includes properties matching the min value", async () => {
      const { body } = await request(app).get("/api/properties?minprice=150");
      const minCostPerNight = Math.max(
        ...body.properties.map((property) => {
          return property.price_per_night;
        })
      );
      expect(minCostPerNight === 150).toBe(true);
    });
  });
});
