exports.handleInvalidPaths = (req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
};

exports.handleBadRequests = (err, req, res, next) => {
  console.log(err);
  const errorCodes = { 42703: "Bad Request", "22P02": "Price Must Be Numeric" };
  if (errorCodes[err.code]) {
    res.status(400).send({ msg: errorCodes[err.code] });
  } else {
    next(err);
  }
};

exports.handleDeclaredErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Server Error" });
};
