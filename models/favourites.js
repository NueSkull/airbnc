const db = require("../db/connection");
const { validUserCheck } = require("./users");

exports.hasUserFavourited = async (prop_id, user_id) => {
  await validUserCheck(user_id);
  const result = await db.query(
    `SELECT * FROM favourites WHERE property_id = $1 AND guest_id = $2;`,
    [prop_id, user_id]
  );
  const favourited = result.rows.length > 0 ? true : false;
  return favourited;
};
