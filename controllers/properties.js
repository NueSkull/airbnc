const { getProperties } = require("../models/properties.js");

exports.getProperties = async (req, res, next) => {
  const { maxprice, minprice, property_type } = req.query;
  const properties = await getProperties(maxprice, minprice, property_type);
  res.status(200).send({ properties });
};
