const db = require("../db/connection");

exports.checkPropertyType = async (property_type) => {
  const availablePropertyTypesQuery = await db.query(
    `SELECT DISTINCT(property_type) FROM property_types`
  );
  const propertyTypes = availablePropertyTypesQuery.rows.map((propType) => {
    return propType.property_type;
  });
  if (!propertyTypes.includes(property_type)) {
    return Promise.reject({
      status: 404,
      msg: "No results found for property_type",
    });
  }
};
