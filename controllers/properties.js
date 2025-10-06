const { getProperties } = require("../models/properties.js");

exports.getProperties = async (req, res, next) => {
  const { maxprice, minprice } = req.query;
  const properties = await getProperties(maxprice, minprice);
  res.status(200).send({ properties });
};
