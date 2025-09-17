const db = require("./connection");
const format = require("pg-format");
const jsonToArray = require("../../utilities/jsonToArray");

async function seed(propertyTypesData, usersData, propertiesData, reviewsData) {
  // Table Drops
  await db.query(`DROP TABLE IF EXISTS properties;`);
  await db.query(`DROP TABLE IF EXISTS property_types;`);
  await db.query(`DROP TABLE IF EXISTS users;`);

  // Property Types
  await db.query(`CREATE TABLE property_types (
        property_type VARCHAR PRIMARY KEY NOT NULL,
        description TEXT NOT NULL
        );`);

  const { rows: insertedPropertyTypes } = await db.query(
    format(
      "INSERT INTO property_types (property_type, description) VALUES %L RETURNING *",
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
      "INSERT INTO users (first_name, surname, email, phone_number, is_host, avatar) VALUES %L RETURNING *",
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

  const propertyValues = jsonToArray(propertiesData).map(async (property) => {
    const [
      name,
      property_type,
      location,
      price_per_night,
      description,
      host_name,
    ] = property;

    const findHostId = await db.query(
      `SELECT user_id FROM users WHERE CONCAT(first_name, ' ', surname) = $1`,
      [host_name]
    );

    const hostId = findHostId.rows[0].user_id;

    return [
      name,
      property_type,
      location,
      price_per_night,
      description,
      hostId,
    ];
  });

  const dataWithHostIds = await Promise.all(propertyValues);

  const { rows: insertedProperties } = await db.query(
    format(
      "INSERT INTO properties (name, property_type, location, price_per_night, description, host_id) VALUES %L RETURNING *",
      dataWithHostIds
    )
  );

  // Reviews

  db.query(`CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    property_id INT NOT NULL REFERENCES properties(property_id),
    guest_id INT NOT NULL REFERENCES users(user_id),
    rating INT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT current_timestamp
    );`);
}

module.exports = seed;
