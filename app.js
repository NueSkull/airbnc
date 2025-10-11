const express = require("express");
const app = express();

const { getProperties } = require("./controllers/properties");
const {
  handleInvalidPaths,
  handleBadRequests,
  handleDeclaredErrors,
  handleServerErrors,
  handleInvalidMethods,
} = require("./errors");

app.route("/api/properties").get(getProperties).all(handleInvalidMethods);

app.all("/*path", handleInvalidPaths);
app.use(handleBadRequests);
app.use(handleDeclaredErrors);
app.use(handleServerErrors);

module.exports = app;
