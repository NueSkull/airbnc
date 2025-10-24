const express = require("express");
const app = express();

const { getProperties, getProperty } = require("./controllers/properties");
const { getReviews, postReview } = require("./controllers/reviews");
const { getUsers } = require("./controllers/users");
const {
  handleInvalidPaths,
  handleBadRequests,
  handleDeclaredErrors,
  handleServerErrors,
  handleInvalidMethods,
} = require("./errors");

app.use(express.json());
app.route("/api/properties").get(getProperties).all(handleInvalidMethods);
app.route("/api/properties/:id").get(getProperty).all(handleInvalidMethods);
app
  .route("/api/properties/:id/reviews")
  .get(getReviews)
  .post(postReview)
  .all(handleInvalidMethods);
app.route("/api/users/:id").get(getUsers).all(handleInvalidMethods);

app.all("/*path", handleInvalidPaths);
app.use(handleDeclaredErrors);
app.use(handleBadRequests);
app.use(handleServerErrors);

module.exports = app;
