const express = require("express");
const app = express();

const { getProperties } = require("./controllers/properties");

app.get("/api/properties", getProperties);

app.all("/*path", (req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
