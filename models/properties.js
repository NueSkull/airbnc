const db = require("../db/connection");

exports.getProperties = async () => {
  const result = await db.query(`SELECT 
    p.property_id, p.name AS property_name, CONCAT(u.first_name,' ', u.surname) as host, p.location, p.price_per_night 
    FROM properties as p
    JOIN users as u ON p.host_id = u.user_id
    JOIN reviews as r ON p.property_id = r.property_id
    GROUP BY p.property_id, p.name, CONCAT(u.first_name,' ', u.surname), p.location, p.price_per_night
    ORDER BY AVG(r.rating) DESC;`);
  return result.rows;
};
