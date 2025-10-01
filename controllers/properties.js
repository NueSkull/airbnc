const { getProperties } = require("../models/properties.js");

exports.getProperties = async (req, res, next) => {
  const properties = await getProperties();
  res.status(200).send({ properties });
};
