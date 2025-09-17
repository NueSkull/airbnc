const seed = require("./seed");
const db = require("./connection");
const {
  bookingsData,
  favouritesData,
  imagesData,
  propertiesData,
  propertyTypesData,
  reviewsData,
  usersData,
} = require("../db/data/test/index");

seed(propertyTypesData, usersData, propertiesData, reviewsData).then(() => {
  db.end();
});
