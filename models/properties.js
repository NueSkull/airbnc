const db = require("../funcs/db/connection");

exports.getProperties = async () => {
  const result = await db.query("SELECT * FROM properties;");
  return result.rows;
};
