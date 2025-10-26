const {
  getReviews,
  getAverageReviewScore,
  insertReview,
  deleteReview,
} = require("../models/reviews");

exports.getReviews = async (req, res, next) => {
  const prop_id = req.params.id;

  const reviews = await getReviews(prop_id);
  const average_rating = await getAverageReviewScore(prop_id);

  res.status(200).send({ reviews, average_rating });
};

exports.postReview = async (req, res, next) => {
  const property_id = req.params.id;

  if (!req.body) {
    return Promise.reject({ status: 400, msg: "No body" });
  }

  const { guest_id, rating, comment } = req.body;
  const insertedReview = await insertReview(
    property_id,
    guest_id,
    rating,
    comment
  );
  res.status(201).send(insertedReview);
};

exports.deleteReview = async (req, res, next) => {
  const reviewid = req.params.id;
  await deleteReview(reviewid);
  res.status(204).send({});
};
