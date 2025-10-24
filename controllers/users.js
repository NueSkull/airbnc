const { getUser } = require("../models/users");

exports.getUsers = async (req, res, next) => {
  const userid = req.params.id;
  const user = await getUser(userid);
  res.status(200).send({ user });
};
