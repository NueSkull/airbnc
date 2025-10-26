const seed = require("./seed");
const db = require("../connection");
const {
  bookingsData,
  favouritesData,
  imagesData,
  propertiesData,
  propertyTypesData,
  reviewsData,
  usersData,
} = require("../data");

seed(
  propertyTypesData,
  usersData,
  propertiesData,
  reviewsData,
  imagesData,
  favouritesData,
  bookingsData
).then(() => {
  db.end();
});
