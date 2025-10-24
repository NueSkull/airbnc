exports.handleInvalidMethods = (req, res, next) => {
  res.status(405).send({ msg: "Invalid Method." });
};

exports.handleInvalidPaths = (req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
};

exports.handleDeclaredErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleBadRequests = (err, req, res, next) => {
  const errorCodes400 = {
    42703: "Bad Request",
    "22P02": "Input must be a number",
    23502: "Value cannot be null",
  };
  const errorCodes404 = {
    23503: "Passed Parameter does not exist",
  };
  if (errorCodes400[err.code]) {
    res.status(400).send({ msg: errorCodes400[err.code] });
  } else if (errorCodes404[err.code]) {
    res.status(404).send({ msg: errorCodes404[err.code] });
  } else {
    next(err);
  }
};

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Server Error" });
};
