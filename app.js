const express = require("express");
const app = express();

const { getProperties, getProperty } = require("./controllers/properties");
const {
  handleInvalidPaths,
  handleBadRequests,
  handleDeclaredErrors,
  handleServerErrors,
  handleInvalidMethods,
} = require("./errors");

app.route("/api/properties").get(getProperties).all(handleInvalidMethods);
app.route("/api/properties/:id").get(getProperty).all(handleInvalidMethods);

app.all("/*path", handleInvalidPaths);
app.use(handleDeclaredErrors);
app.use(handleBadRequests);
app.use(handleServerErrors);

module.exports = app;
