const { getProperties } = require("../models/properties.js");

exports.getProperties = async (req, res, next) => {
  const { maxprice, minprice, property_type, sort, order } = req.query;

  const validSort = {
    cost_per_night: "p.price_per_night",
    popularity: "COUNT(f.property_id)",
  };

  const validOrder = ["ASC", "DESC"];

  if (sort && !validSort[sort]) {
    return next({ status: 400, msg: "Bad Request" });
  } else if (sort && validSort[sort]) {
    sortValue = validSort[sort];
  } else {
    sortValue = "COUNT(f.property_id)";
  }

  if (order && !validOrder.includes(order)) {
    return next({ status: 400, msg: "Bad Request" });
  } else if (order && validOrder.includes(order)) {
    orderValue = order;
  } else {
    orderValue = "DESC";
  }

  const isNumeric = /^[0-9]+$/;

  if (minprice && !isNumeric.test(minprice)) {
    return next({ status: 400, msg: "minprice must be numeric" });
  }

  if (maxprice && !isNumeric.test(maxprice)) {
    return next({ status: 400, msg: "maxprice must be numeric" });
  }

  const properties = await getProperties(
    maxprice,
    minprice,
    property_type,
    sortValue,
    orderValue
  );

  res.status(200).send({ properties });
};
