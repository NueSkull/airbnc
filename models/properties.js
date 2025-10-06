const db = require("../db/connection");

exports.getProperties = async (
  maxprice,
  minprice,
  property_type,
  sort = "rating",
  order = "DESC"
) => {
  const validSort = {
    rating: "AVG(r.rating)",
    cost_per_night: "p.price_per_night",
    popularity: "COUNT(f.property_name)",
  };

  const validOrder = ["ASC", "DESC"];

  const sortValue = validSort[sort] || validSort.rating;
  const orderValue = validOrder.includes(order) ? order : "DESC";

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

  if (sort === "popularity") {
    query += `JOIN favourites as f ON p.property_name = f.property_name \n`;
  }
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

  if (sort === "popularity") {
    // RESUME HERE, group by needs to be on property name for the COUNT order metric
  } else {
    query += `GROUP BY p.property_id, p.name, CONCAT(u.first_name,' ', u.surname), p.location, p.price_per_night `;
  }

  query += `ORDER BY ${sortValue} ${orderValue};`;

  const result = await db.query(query, queries);
  return result.rows;
};
