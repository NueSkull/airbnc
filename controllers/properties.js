const { getProperties } = require("../models/properties.js");

exports.getProperties = async (req, res, next) => {
  const { maxprice } = req.query;
  const properties = await getProperties(maxprice);
  res.status(200).send({ properties });
};
