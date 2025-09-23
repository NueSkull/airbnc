const db = require("./connection");
const format = require("pg-format");
const {
  jsonToArray,
  createReferenceTable,
  mapAdjustedData,
  mergeNames,
  arrangeArray,
  mapAmenities,
  getUniqueAmenities,
} = require("../../utilities/utilities.js");

async function seed(
  propertyTypesData,
  usersData,
  propertiesData,
  reviewsData,
  imageData,
  favouritesData,
  bookingsData
) {
  // Table Drops

  await db.query(`DROP TABLE IF EXISTS properties_amenities;`);
  await db.query(`DROP TABLE IF EXISTS amenities;`);
  await db.query(`DROP TABLE IF EXISTS bookings;`);
  await db.query(`DROP TABLE IF EXISTS favourites;`);
  await db.query(`DROP TABLE IF EXISTS images;`);
  await db.query(`DROP TABLE IF EXISTS reviews;`);
  await db.query(`DROP TABLE IF EXISTS properties;`);
  await db.query(`DROP TABLE IF EXISTS property_types;`);
  await db.query(`DROP TABLE IF EXISTS users;`);

  // Property Types

  await db.query(`CREATE TABLE property_types (
        property_type VARCHAR PRIMARY KEY NOT NULL,
        description TEXT NOT NULL
        );`);

  await db.query(
    format(
      "INSERT INTO property_types (property_type, description) VALUES %L;",
      jsonToArray(propertyTypesData)
    )
  );

  // Users

  await db.query(`CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR NOT NULL,
    surname VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    phone_number VARCHAR,
    is_host BOOLEAN NOT NULL,
    avatar VARCHAR,
    created_at TIMESTAMP DEFAULT current_timestamp
    );`);

  const { rows: insertedUsers } = await db.query(
    format(
      "INSERT INTO users (first_name, surname, email, phone_number, is_host, avatar) VALUES %L RETURNING *;",
      jsonToArray(usersData)
    )
  );

  // Properties

  await db.query(`CREATE TABLE properties (
    property_id SERIAL PRIMARY KEY,
    host_id INT NOT NULL REFERENCES users(user_id),
    name VARCHAR NOT NULL,
    location VARCHAR NOT NULL,
    property_type VARCHAR NOT NULL REFERENCES property_types(property_type),
    price_per_night DECIMAL NOT NULL,
    description TEXT
    );`);

  const fullNames = mergeNames(insertedUsers);
  const userReferenceTable = createReferenceTable(fullNames, "name", "user_id");
  const mappedUsersProperties = mapAdjustedData(
    propertiesData,
    "host_name",
    "user_id",
    userReferenceTable
  );
  const rearrangedProperties = arrangeArray(mappedUsersProperties, [
    "name",
    "property_type",
    "location",
    "price_per_night",
    "description",
    "user_id",
  ]);

  const { rows: insertedProperties } = await db.query(
    format(
      "INSERT INTO properties (name, property_type, location, price_per_night, description, host_id) VALUES %L RETURNING *;",
      jsonToArray(rearrangedProperties)
    )
  );

  // Reviews

  await db.query(`CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    property_id INT NOT NULL REFERENCES properties(property_id),
    guest_id INT NOT NULL REFERENCES users(user_id),
    rating INT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT current_timestamp
    );`);

  const propertyReferenceTable = createReferenceTable(
    insertedProperties,
    "name",
    "property_id"
  );

  const propertyNameToId = mapAdjustedData(
    reviewsData,
    "property_name",
    "property_id",
    propertyReferenceTable
  );

  const reviewsWithUserId = mapAdjustedData(
    propertyNameToId,
    "guest_name",
    "user_id",
    userReferenceTable
  );

  await db.query(
    format(
      "INSERT INTO reviews (guest_id, property_id, rating, comment, created_at) VALUES %L;",
      jsonToArray(reviewsWithUserId)
    )
  );

  // Imagery

  await db.query(`CREATE TABLE images (
    image_id SERIAL PRIMARY KEY,
    property_id INT NOT NULL REFERENCES properties(property_id),
    image_url VARCHAR NOT NULL,
    alt_text VARCHAR NOT NULL
    );`);

  const propertyIdImages = mapAdjustedData(
    imageData,
    "property_name",
    "property_id",
    propertyReferenceTable
  );

  await db.query(
    format(
      "INSERT INTO images (property_id, image_url, alt_text) VALUES %L;",
      jsonToArray(propertyIdImages)
    )
  );

  // Favourites

  await db.query(`CREATE TABLE favourites (
    favourite_id SERIAL PRIMARY KEY,
    guest_id INT NOT NULL REFERENCES users(user_id),
    property_id INT NOT NULL REFERENCES properties(property_id)
    );`);

  const favouriteUsers = mapAdjustedData(
    favouritesData,
    "guest_name",
    "user_id",
    userReferenceTable
  );

  const favouriteProperties = mapAdjustedData(
    favouriteUsers,
    "property_name",
    "property_id",
    propertyReferenceTable
  );

  await db.query(
    format(
      "INSERT INTO favourites (guest_id, property_id) VALUES %L;",
      jsonToArray(favouriteProperties)
    )
  );

  // Bookings

  await db.query(`CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
    property_id INT NOT NULL REFERENCES properties(property_id),
    guest_id INT NOT NULL REFERENCES users(user_id),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT current_timestamp
    );`);

  const bookingWithUserIds = mapAdjustedData(
    bookingsData,
    "guest_name",
    "user_id",
    userReferenceTable
  );

  const propertiesWithIds = mapAdjustedData(
    bookingWithUserIds,
    "property_name",
    "property_id",
    propertyReferenceTable
  );

  await db.query(
    format(
      "INSERT INTO bookings (property_id, guest_id, check_in_date, check_out_date) VALUES %L;",
      jsonToArray(propertiesWithIds)
    )
  );

  // Amenities Table

  await db.query(`CREATE TABLE amenities (
    amenity VARCHAR PRIMARY KEY
    );`);

  const getAmenities = getUniqueAmenities(propertiesData);

  await db.query(
    format("INSERT INTO amenities (amenity) VALUES %L;", getAmenities)
  );

  // Properties_Amenities

  await db.query(`CREATE TABLE properties_amenities (
    property_amenity_id SERIAL PRIMARY KEY,
    property_id INT NOT NULL REFERENCES properties(property_id),
    amenity_slug VARCHAR NOT NULL REFERENCES amenities(amenity)
    );`);

  const propertiesWithAmenties = mapAdjustedData(
    propertiesData,
    "name",
    "property_id",
    propertyReferenceTable
  );

  const mappedAmenities = mapAmenities(
    propertiesWithAmenties,
    "property_id",
    "amenities"
  );

  await db.query(
    format(
      "INSERT INTO properties_amenities (property_id, amenity_slug) VALUES %L;",
      jsonToArray(mappedAmenities)
    )
  );
}

module.exports = seed;
