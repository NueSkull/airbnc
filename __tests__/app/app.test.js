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
    test("405 - incorrect method used on valid path", () => {
      const methods = ["post", "put", "patch", "delete"];
      methods.forEach(async (method) => {
        const { status, body } = await request(app)[method]("/api/properties");
        expect(status).toBe(405);
        expect(body.msg).toBe("Invalid Method.");
      });
    });
    test("405 - incorrect method used on valid path for property reviews", () => {
      const methods = ["put", "patch"];
      methods.forEach(async (method) => {
        const { status, body } = await request(app)[method](
          "/api/properties/1/reviews"
        );
        expect(status).toBe(405);
        expect(body.msg).toBe("Invalid Method.");
      });
    });
  });
  describe("GET /api/properties", () => {
    describe("Successful Responses", () => {
      test("should respond with status 200", async () => {
        await request(app).get("/api/properties").expect(200);
      });
      test("response has property of properties", async () => {
        const { body } = await request(app).get("/api/properties");
        expect(body).toHaveProperty("properties");
      });
      test("response is array of properties", async () => {
        const { body } = await request(app).get("/api/properties");
        expect(Array.isArray(body.properties)).toBe(true);
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
      test("response of properties is sorted by most to least favourite", async () => {
        const { body } = await request(app).get("/api/properties");
        const lengthOfResponses = body.properties.length - 1;
        const actualMostFavouritedProperties = await db.query(
          `SELECT COUNT(property_id), property_id FROM favourites GROUP BY property_id ORDER BY COUNT(property_id) DESC;`
        );
        expect(
          body.properties[0].property_id ===
            actualMostFavouritedProperties.rows[0].property_id
        ).toBe(true);
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
    describe("Error Responses", () => {
      test("Invalid sort query returns 400 and message Invalid Sort Property", async () => {
        const { status, body } = await request(app).get(
          "/api/properties?sort=invalidsort"
        );

        expect(status).toBe(400);
        expect(body.msg).toBe("Invalid Sort Property");
      });
      test("Invalid order query returns 400 and message Invalid Order Property", async () => {
        const { status, body } = await request(app).get(
          "/api/properties?order=invalidorder"
        );

        expect(status).toBe(400);
        expect(body.msg).toBe("Invalid Order Property");
      });
      test("None numeric minprice will return Status 400 and msg 'Input must be a number'", async () => {
        const { status, body } = await request(app).get(
          "/api/properties?minprice=textbased"
        );

        expect(status).toBe(400);
        expect(body.msg).toBe("Input must be a number");
      });
      test("None numeric maxprice will return Status 400 and msg 'Input must be a number'", async () => {
        const { status, body } = await request(app).get(
          "/api/properties?maxprice=textbased"
        );

        expect(status).toBe(400);
        expect(body.msg).toBe("Input must be a number");
      });
      test("None existing property_type returns 404", async () => {
        const { status, body } = await request(app).get(
          "/api/properties?property_type=caravan"
        );

        expect(status).toBe(404);
        expect(body.msg).toBe("No results found for property_type");
      });
    });
  });
  describe("GET /api/properties/:id", () => {
    describe("Successful Responses", () => {
      test("Response has status of 200", async () => {
        await request(app).get("/api/properties/1").expect(200);
      });
      test("response has property of property", async () => {
        const { body } = await request(app).get("/api/properties/1");
        expect(body).toHaveProperty("property");
      });
      test("Property in response is of correct property_ID", async () => {
        const { body } = await request(app).get("/api/properties/2");
        expect(body.property.property_id).toBe(2);
      });
      test("Response has correct properties (from same table)", async () => {
        const { body } = await request(app).get("/api/properties/3");

        expect(body.property).toHaveProperty("property_id");
        expect(body.property).toHaveProperty("property_name");
        expect(body.property).toHaveProperty("location");
        expect(body.property).toHaveProperty("price_per_night");
        expect(body.property).toHaveProperty("description");
      });
      test("Response has host property", async () => {
        const { body } = await request(app).get("/api/properties/4");

        expect(body.property).toHaveProperty("host");
      });
      test("Response has host_avatar property", async () => {
        const { body } = await request(app).get("/api/properties/4");

        expect(body.property).toHaveProperty("host_avatar");
      });
      test("Response has favourite_count property", async () => {
        const { body } = await request(app).get("/api/properties/4");

        expect(body.property).toHaveProperty("favourite_count");
      });
      test("when passed a user ID, includes new property of favourited", async () => {
        const { body } = await request(app).get("/api/properties/1?user_id=1");
        expect(body.property).toHaveProperty("favourited");
      });
      test("If user_id has not favourited the property, returns false", async () => {
        const { body } = await request(app).get("/api/properties/1?user_id=1");
        expect(body.property.favourited).toBe(false);
      });
      test("If user_id has favourited property, returns true", async () => {
        const { body } = await request(app).get("/api/properties/1?user_id=6");
        expect(body.property.favourited).toBe(true);
      });
    });
    describe("Error Responses", () => {
      test("Unknown property ID returns 404 - Property Not Found", async () => {
        const { status, body } = await request(app).get(
          "/api/properties/99999"
        );

        expect(status).toBe(404);
        expect(body.msg).toBe("Property Not Found");
      });
      test("Invalid property ID value return 400 - Input must be a number", async () => {
        const { status, body } = await request(app).get(
          "/api/properties/ahouse"
        );

        expect(status).toBe(400);
        expect(body.msg).toBe("Input must be a number");
      });
      test("Unknown user ID returns 404 - User Not Found", async () => {
        const { status, body } = await request(app).get(
          "/api/properties/1?user_id=999999"
        );

        expect(status).toBe(404);
        expect(body.msg).toBe("User Not Found");
      });
      test("Invalid user ID value returns 400 - Input must be a number", async () => {
        const { status, body } = await request(app).get(
          "/api/properties/1?user_id=personsname"
        );

        expect(status).toBe(400);
        expect(body.msg).toBe("Input must be a number");
      });
      test("405 - incorrect method used on valid path", () => {
        const methods = ["post", "put", "patch", "delete"];
        methods.forEach(async (method) => {
          const { status, body } = await request(app)[method](
            "/api/properties/1"
          );
          expect(status).toBe(405);
          expect(body.msg).toBe("Invalid Method.");
        });
      });
    });
  });
  describe("GET /api/properties/:id/reviews", () => {
    describe("Successful responses", () => {
      const reviewPath = "/api/properties/1/reviews";
      test("should respond with status 200", async () => {
        await request(app).get(reviewPath).expect(200);
      });
      test("response has property of reviews", async () => {
        const { body } = await request(app).get(reviewPath);
        expect(body).toHaveProperty("reviews");
      });
      test("response is array of reviews", async () => {
        const { body } = await request(app).get(reviewPath);
        expect(Array.isArray(body.reviews)).toBe(true);
      });
      test("response of reviews has length", async () => {
        const { body } = await request(app).get(reviewPath);
        expect(body.reviews.length).toBeGreaterThan(0);
      });
      test("check review has review_id value", async () => {
        const { body } = await request(app).get(reviewPath);
        const singleReview = body.reviews[0];
        expect(singleReview).toHaveProperty("review_id");
      });
      test("check review has comment value", async () => {
        const { body } = await request(app).get(reviewPath);
        const singleReview = body.reviews[0];
        expect(singleReview).toHaveProperty("comment");
      });
      test("check review has rating value", async () => {
        const { body } = await request(app).get(reviewPath);
        const singleReview = body.reviews[0];
        expect(singleReview).toHaveProperty("rating");
      });
      test("check review has created_at value", async () => {
        const { body } = await request(app).get(reviewPath);
        const singleReview = body.reviews[0];
        expect(singleReview).toHaveProperty("created_at");
      });
      test("check review has review_id value", async () => {
        const { body } = await request(app).get(reviewPath);
        const singleReview = body.reviews[0];
        expect(singleReview).toHaveProperty("guest");
      });
      test("check review has review_id value", async () => {
        const { body } = await request(app).get(reviewPath);
        const singleReview = body.reviews[0];
        expect(singleReview).toHaveProperty("guest_avatar");
      });
      test("response has a single property of average_rating", async () => {
        const { body } = await request(app).get(reviewPath);
        expect(body).toHaveProperty("average_rating");
      });
      test("response is ordered by newest rating to oldest", async () => {
        const { body } = await request(app).get(reviewPath);
        const firstReviewDate = body.reviews[0].created_at;
        const lastReviewDate = body.reviews[body.reviews.length - 1].created_at;
        expect(firstReviewDate > lastReviewDate).toBe(true);
      });
    });
    describe("Error responses", () => {
      test("A property with no reviews returns 404 - Reviews Not Found", async () => {
        const { status, body } = await request(app).get(
          "/api/properties/99999/reviews"
        );

        expect(status).toBe(404);
        expect(body.msg).toBe("Reviews Not Found");
      });
      test("Invalid property ID value return 400 - Input must be a number", async () => {
        const { status, body } = await request(app).get(
          "/api/properties/ahouse/reviews"
        );

        expect(status).toBe(400);
        expect(body.msg).toBe("Input must be a number");
      });
    });
  });
  describe("GET /api/users/:id", () => {
    describe("Successful responses", () => {
      test("responds with status 200", async () => {
        await request(app).get("/api/users/1").expect(200);
      });
      test("response has property of user", async () => {
        const { body } = await request(app).get("/api/users/1");
        expect(body).toHaveProperty("user");
      });
      test("response user has property user_id", async () => {
        const { body } = await request(app).get("/api/users/1");
        expect(body.user[0]).toHaveProperty("user_id");
      });
      test("response user has property first_name", async () => {
        const { body } = await request(app).get("/api/users/1");
        expect(body.user[0]).toHaveProperty("first_name");
      });
      test("response user has property surname", async () => {
        const { body } = await request(app).get("/api/users/1");
        expect(body.user[0]).toHaveProperty("surname");
      });
      test("response user has property email", async () => {
        const { body } = await request(app).get("/api/users/1");
        expect(body.user[0]).toHaveProperty("email");
      });
      test("response user has property phone_number", async () => {
        const { body } = await request(app).get("/api/users/1");
        expect(body.user[0]).toHaveProperty("phone_number");
      });
      test("response user has property avatar", async () => {
        const { body } = await request(app).get("/api/users/1");
        expect(body.user[0]).toHaveProperty("avatar");
      });
      test("response user has property created_at", async () => {
        const { body } = await request(app).get("/api/users/1");
        expect(body.user[0]).toHaveProperty("created_at");
      });
    });
    describe("Error responses", () => {
      test("A none existing user_id returns 404 - User Not Found", async () => {
        const { status, body } = await request(app).get("/api/users/99999");

        expect(status).toBe(404);
        expect(body.msg).toBe("User Not Found");
      });
      test("Invalid user_id value return 400 - Input must be a number", async () => {
        const { status, body } = await request(app).get("/api/users/samanthas");

        expect(status).toBe(400);
        expect(body.msg).toBe("Input must be a number");
      });
      test("405 - incorrect method used on valid path", () => {
        const methods = ["post", "put", "patch", "delete"];
        methods.forEach(async (method) => {
          const { status, body } = await request(app)[method]("/api/users/1");
          expect(status).toBe(405);
          expect(body.msg).toBe("Invalid Method.");
        });
      });
    });
  });
  describe("POST /api/properties/:id/reviews", () => {
    describe("Successful responses", () => {
      test("Review can be created with guest_id, rating and comment - returns status 201", async () => {
        const response = await request(app)
          .post("/api/properties/1/reviews")
          .send({
            guest_id: 1,
            rating: 5,
            comment: "Lovely getaway for the family, very clean and tidy!",
          });
        expect(response.status).toBe(201);
      });
      test("Review can be created with guest_id and rating, no comment - returns status 201", async () => {
        const response = await request(app)
          .post("/api/properties/1/reviews")
          .send({
            guest_id: 2,
            rating: 3,
          });
        expect(response.status).toBe(201);
      });
      test("Response has the property of review_id", async () => {
        const response = await request(app)
          .post("/api/properties/1/reviews")
          .send({
            guest_id: 1,
            rating: 5,
            comment: "Lovely getaway for the family, very clean and tidy!",
          });
        expect(response.body).toHaveProperty("review_id");
      });
      test("Response has the property of property_id and matches passed property", async () => {
        const response = await request(app)
          .post("/api/properties/3/reviews")
          .send({
            guest_id: 1,
            rating: 5,
            comment: "Lovely getaway for the family, very clean and tidy!",
          });
        expect(response.body).toHaveProperty("property_id");
        expect(response.body.property_id).toBe(3);
      });
      test("Response has the property of guest_id and matches passed guest_id", async () => {
        const response = await request(app)
          .post("/api/properties/1/reviews")
          .send({
            guest_id: 5,
            rating: 5,
            comment: "Lovely getaway for the family, very clean and tidy!",
          });
        expect(response.body).toHaveProperty("guest_id");
        expect(response.body.guest_id).toBe(5);
      });
      test("Response has the property of rating and matches passed rating", async () => {
        const response = await request(app)
          .post("/api/properties/1/reviews")
          .send({
            guest_id: 1,
            rating: 4,
            comment: "Lovely getaway for the family, very clean and tidy!",
          });
        expect(response.body).toHaveProperty("rating");
        expect(response.body.rating).toBe(4);
      });
      test("Response has the property of comment and matches passed comment", async () => {
        const response = await request(app)
          .post("/api/properties/1/reviews")
          .send({
            guest_id: 1,
            rating: 5,
            comment: "Test comment!",
          });
        expect(response.body).toHaveProperty("comment");
        expect(response.body.comment).toBe("Test comment!");
      });
      test("Response has the property of created_at", async () => {
        const response = await request(app)
          .post("/api/properties/1/reviews")
          .send({
            guest_id: 1,
            rating: 5,
            comment: "Lovely getaway for the family, very clean and tidy!",
          });
        expect(response.body).toHaveProperty("created_at");
      });
      test("Newly created reviews are now in the db table", async () => {
        const response = await request(app)
          .post("/api/properties/4/reviews")
          .send({
            guest_id: 3,
            rating: 2,
            comment: "Could have been tidied and cleaned better.",
          });
        const reviewId = response.body.review_id;

        const reviewProof = await request(app).get("/api/properties/4/reviews");

        expect(reviewProof.body.reviews[0]).toHaveProperty(
          "review_id",
          reviewId
        );
        expect(reviewProof.body.reviews[0]).toHaveProperty(
          "comment",
          "Could have been tidied and cleaned better."
        );
      });
    });
    describe("Error responses", () => {
      test("If no body is sent, return 400 - No body", async () => {
        const { status, body } = await request(app).post(
          "/api/properties/1/reviews"
        );

        expect(status).toBe(400);
        expect(body.msg).toBe("No body");
      });
      test("Request fails if not supplied guest_id", async () => {
        const { status, body } = await request(app)
          .post("/api/properties/1/reviews")
          .send({
            rating: 5,
            comment: "Lovely getaway for the family, very clean and tidy!",
          });

        expect(status).toBe(400);
        expect(body.msg).toBe("Value cannot be null");
      });
      test("Request fails if not supplied rating", async () => {
        const { status, body } = await request(app)
          .post("/api/properties/1/reviews")
          .send({
            guest_id: 1,
            comment: "Lovely getaway for the family, very clean and tidy!",
          });

        expect(status).toBe(400);
        expect(body.msg).toBe("Value cannot be null");
      });
      test("A none existing property_id returns 404 - Passed Parameter does not exist", async () => {
        const { status, body } = await request(app)
          .post("/api/properties/99999/reviews")
          .send({
            guest_id: 1,
            rating: 5,
            comment: "Lovely getaway for the family, very clean and tidy!",
          });

        expect(status).toBe(404);
        expect(body.msg).toBe("Passed Parameter does not exist");
      });
      test("A none existing guest_id returns 404 - Passed Parameter does not exist", async () => {
        const { status, body } = await request(app)
          .post("/api/properties/1/reviews")
          .send({
            guest_id: 1000,
            rating: 5,
            comment: "Lovely getaway for the family, very clean and tidy!",
          });

        expect(status).toBe(404);
        expect(body.msg).toBe("Passed Parameter does not exist");
      });
      test("Invalid guest_id value return 400 - Input must be a number", async () => {
        const { status, body } = await request(app)
          .post("/api/properties/1/reviews")
          .send({
            guest_id: "Ben Franklin",
            rating: 5,
            comment: "Lovely getaway for the family, very clean and tidy!",
          });

        expect(status).toBe(400);
        expect(body.msg).toBe("Input must be a number");
      });
      test("Invalid rating value return 400 - Input must be a number", async () => {
        const { status, body } = await request(app)
          .post("/api/properties/1/reviews")
          .send({
            guest_id: 1,
            rating: "Amazing",
            comment: "Lovely getaway for the family, very clean and tidy!",
          });

        expect(status).toBe(400);
        expect(body.msg).toBe("Input must be a number");
      });
    });
  });
});
