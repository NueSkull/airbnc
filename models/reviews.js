const db = require("../db/connection");

exports.getReviews = async (prop_id) => {
  const reviews = await db.query(
    `SELECT review_id, comment, rating, r.created_at, r.guest_id AS guest, u.avatar AS guest_avatar FROM reviews AS r
     JOIN users AS u ON r.guest_id = u.user_id 
     WHERE property_id = $1 
     ORDER BY r.created_at DESC;`,
    [prop_id]
  );

  if (reviews.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Reviews Not Found" });
  }

  return reviews.rows;
};

exports.getAverageReviewScore = async (prop_id) => {
  const averageRating = await db.query(
    `SELECT AVG(rating) AS averagerating FROM reviews WHERE property_id = $1`,
    [prop_id]
  );

  return averageRating.rows[0].averagerating;
};
