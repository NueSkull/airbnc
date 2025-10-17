const db = require("../db/connection");

exports.validUserCheck = async (user_id) => {
  const result = await db.query(`SELECT * FROM users WHERE user_id = $1;`, [
    user_id,
  ]);
  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "User Not Found" });
  }
};
