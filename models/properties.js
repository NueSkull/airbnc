const db = require("../db/connection");

exports.getProperties = async (
  maxprice,
  minprice,
  property_type,
  sort,
  order
) => {
  let sortValue;
  let orderValue;

  const validSort = {
    cost_per_night: "p.price_per_night",
    popularity: "COUNT(f.property_id)",
  };

  const validOrder = ["ASC", "DESC"];

  if (sort && !validSort[sort]) {
    return Promise.reject({ status: 400, msg: "Invalid Sort Property" });
  } else if (sort && validSort[sort]) {
    sortValue = validSort[sort];
  } else {
    sortValue = "COUNT(f.property_id)";
  }

  if (order && !validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid Order Property" });
  } else if (order && validOrder.includes(order)) {
    orderValue = order;
  } else {
    orderValue = "DESC";
  }

  const queries = [];
  let queryCount = 0;
  const whereOrAnd = function () {
    if (queryCount === 0) {
      return "WHERE";
    } else {
      return "AND";
    }
  };

  let query = `SELECT 
    p.property_id, p.name AS property_name, CONCAT(u.first_name,' ', u.surname) as host, p.location, p.price_per_night 
    FROM properties as p
    JOIN users as u ON p.host_id = u.user_id
    LEFT JOIN favourites as f ON p.property_id = f.property_id \n`;

  if (maxprice) {
    query += `${whereOrAnd()} p.price_per_night <= $${++queryCount} \n`;
    queries.push(maxprice);
  }

  if (minprice) {
    query += `${whereOrAnd()} p.price_per_night >= $${++queryCount} \n`;
    queries.push(minprice);
  }

  if (property_type) {
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
    query += `${whereOrAnd()} p.property_type = $${++queryCount} \n`;
    queries.push(property_type);
  }

  query += `GROUP BY p.property_id, p.name, CONCAT(u.first_name,' ', u.surname), p.location, p.price_per_night
  ORDER BY ${sortValue} ${orderValue};`;

  const result = await db.query(query, queries);
  return result.rows;
};
