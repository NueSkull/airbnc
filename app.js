const express = require("express");
const app = express();

const { getProperties } = require("./controllers/properties");
const {
  handleInvalidPaths,
  handleBadRequests,
  handleDeclaredErrors,
  handleServerErrors,
} = require("./errors");

app.get("/api/properties", getProperties);

app.all("/*path", handleInvalidPaths);
app.use(handleBadRequests);
app.use(handleDeclaredErrors);
app.use(handleServerErrors);

module.exports = app;
