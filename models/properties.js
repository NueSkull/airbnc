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
    // Move this to its own function mmmmk thanks, same with other 2 tests, check all my errors if they make sense etc
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

exports.getProperty = async (prop_id, user_id) => {
  if (Number.isNaN(prop_id)) {
    return Promise.reject({ status: 400, msg: "Invalid Property ID" });
  }

  let result = await db.query(
    `SELECT p.property_id, p.name AS property_name, p.location, p.price_per_night, p.description, CONCAT(u.first_name, u.surname) AS host, u.avatar AS host_avatar, COUNT(f.property_id) AS favourite_count FROM properties AS p
    JOIN users AS u ON p.host_id = u.user_id 
    LEFT JOIN favourites AS f ON p.property_id = f.property_id 
    WHERE p.property_id = $1
    GROUP BY p.property_id, p.name, p.location, p.price_per_night, p.description, host, host_avatar`,
    [prop_id]
  );

  if (user_id) {
    const hasUserFavourited = await db.query(
      `SELECT * FROM favourites WHERE property_id = $1 AND guest_id = $2;`,
      [prop_id, user_id]
    );
    result.rows[0].favourited =
      hasUserFavourited.rows.length > 0 ? true : false;
  }

  return result.rows[0];
};
