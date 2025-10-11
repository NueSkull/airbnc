const { getProperties } = require("../models/properties.js");

exports.getProperties = async (req, res, next) => {
  const { maxprice, minprice, property_type, sort, order } = req.query;

  const properties = await getProperties(
    maxprice,
    minprice,
    property_type,
    sort,
    order
  );

  res.status(200).send({ properties });
};
