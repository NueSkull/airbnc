const db = require("../db/connection");

exports.getProperties = async (maxprice, minprice, property_type) => {
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
    LEFT JOIN reviews as r ON p.property_id = r.property_id \n`;

  if (maxprice) {
    query += `${whereOrAnd()} p.price_per_night <= $${++queryCount} \n`;
    queries.push(maxprice);
  }

  if (minprice) {
    query += `${whereOrAnd()} p.price_per_night >= $${++queryCount} \n`;
    queries.push(minprice);
  }

  if (property_type) {
    query += `${whereOrAnd()} p.property_type = $${++queryCount} \n`;
    queries.push(property_type);
  }

  query += `GROUP BY p.property_id, p.name, CONCAT(u.first_name,' ', u.surname), p.location, p.price_per_night
    ORDER BY AVG(r.rating) DESC;`;

  const result = await db.query(query, queries);
  return result.rows;
};
