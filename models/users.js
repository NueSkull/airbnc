const db = require("../db/connection");

const validUserCheck = async (user_id) => {
  const result = await db.query(`SELECT * FROM users WHERE user_id = $1;`, [
    user_id,
  ]);
  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "User Not Found" });
  }
};

const getUser = async (user_id) => {
  const result = await db.query(
    `SELECT user_id, first_name, surname, email, phone_number, avatar, created_at FROM users WHERE user_id = $1;`,
    [user_id]
  );

  if (result.rows.length === 0) {
    await validUserCheck(user_id);
  }
  return result.rows;
};

module.exports = { validUserCheck, getUser };
