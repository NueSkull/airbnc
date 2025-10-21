const { getReviews, getAverageReviewScore } = require("../models/reviews");

exports.getReviews = async (req, res, next) => {
  const prop_id = req.params.id;

  const reviews = await getReviews(prop_id);
  const average_rating = await getAverageReviewScore(prop_id);

  res.status(200).send({ reviews, average_rating });
};
