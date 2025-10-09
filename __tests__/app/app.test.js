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
  describe("GET /api/properties - OK Responses", () => {
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
      expect(
        body.properties[0].favourites >
          body.properties[lengthOfResponses].favourites
      ).toBe(true);
      // come back to this one, use the favourites API for comparison
    });
    test("returns all results including properties with and without being favourites", async () => {
      const { body } = await request(app).get("/api/properties");
      expect(body.properties.length).toBe(11);
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
      const { body } = await request(app).get("/api/properties?maxprice=200");
      const maxCostPerNight = Math.max(
        ...body.properties.map((property) => {
          return property.price_per_night;
        })
      );
      expect(maxCostPerNight === 200).toBe(true);
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
      const { body } = await request(app).get("/api/properties?minprice=110");
      const minCostPerNight = Math.min(
        ...body.properties.map((property) => {
          return property.price_per_night;
        })
      );
      expect(minCostPerNight === 110).toBe(true);
    });
    test("when using both queries, brings back those between the passed values", async () => {
      const { body } = await request(app).get(
        "/api/properties?minprice=100&maxprice=200"
      );
      const minCostPerNight = Math.min(
        ...body.properties.map((property) => {
          return property.price_per_night;
        })
      );
      const maxCostPerNight = Math.max(
        ...body.properties.map((property) => {
          return property.price_per_night;
        })
      );
      expect(minCostPerNight >= 100 && maxCostPerNight <= 200).toBe(true);
    });
    test("accepts a query of property_type that returns back properties of that type", async () => {
      const studio = request(app).get("/api/properties?property_type=Studio");
      const apartment = request(app).get(
        "/api/properties?property_type=Apartment"
      );
      const house = request(app).get("/api/properties?property_type=House");
      const [studioResponse, apartmentResponse, houseResponse] =
        await Promise.all([studio, apartment, house]);

      expect(studioResponse.body.properties.length).toBe(4);
      expect(apartmentResponse.body.properties.length).toBe(4);
      expect(houseResponse.body.properties.length).toBe(3);
    });
    test("API accepts sort query with cost_per_night ", async () => {
      const { body } = await request(app).get(
        "/api/properties?sort=cost_per_night"
      );
      expect(body.properties[0].price_per_night).toBe("250");
    });
    test("API accepts sort query with popularity", async () => {
      const { body } = await request(app).get(
        "/api/properties?sort=popularity"
      );
      expect(body.properties[0].property_name).toBe("Cosy Family House");
    });
    test("API accepts order as ASC", async () => {
      const { body } = await request(app).get(
        "/api/properties?sort=cost_per_night&order=ASC"
      );
      expect(body.properties[0].price_per_night).toBe("85");
    });
  });
  describe("GET /api/properties - Error Responses", () => {
    test("Invalid sort query returns 400", async () => {
      const { status, body } = await request(app).get(
        "/api/properties?sort=invalidsort"
      );

      expect(status).toBe(400);
      expect(body.msg).toBe("Bad Request");
    });
    test("Invalid order query returns 400", async () => {
      const { status, body } = await request(app).get(
        "/api/properties?order=invalidorder"
      );

      expect(status).toBe(400);
      expect(body.msg).toBe("Bad Request");
    });
    test("minprice must be numeric", async () => {
      const { status, body } = await request(app).get(
        "/api/properties?minprice=textbased"
      );

      expect(status).toBe(400);
      expect(body.msg).toBe("minprice must be numeric");
    });
    test("maxprice must be numeric", async () => {
      const { status, body } = await request(app).get(
        "/api/properties?maxprice=textbased"
      );

      expect(status).toBe(400);
      expect(body.msg).toBe("maxprice must be numeric");
    });
    test("None existing property_type returns 404", async () => {
      const { status, body } = await request(app).get(
        "/api/properties?property_type=caravan"
      );

      expect(status).toBe(404);
      expect(body.msg).toBe("No results found");
    });
  });
});
