const db = require("./connection");
const format = require("pg-format");
const jsonToArray = require("./jsonToArray");
const {
  bookingsData,
  favouritesData,
  imagesData,
  propertiesData,
  propertyTypesData,
  reviewsData,
  usersData,
} = require("../db/data/test/index");

async function seed() {
  await db.query(`DROP TABLE IF EXISTS property_types;`);

  await db.query(`CREATE TABLE property_types (
        property_type VARCHAR PRIMARY KEY NOT NULL,
        description TEXT NOT NULL
        );`);

  await db.query(
    format(
      "INSERT INTO property_types (property_type, description) VALUES %L",
      jsonToArray(propertyTypesData)
    )
  );

  const testResponse = await db.query("SELECT * FROM property_types;");

  console.log(testResponse);
}

module.exports = seed;
