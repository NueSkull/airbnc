const jsonToArray = require("./db/jsonToArray");
const createReferenceTable = require("./db/createReferenceTable");
const mapAdjustedData = require("./db/mapAdjustedData");
const mergeNames = require("./db/mergeNames");
const arrangeArray = require("./db/arrangeArray");
const mapAmenities = require("./db/mapAmenities");
const getUniqueAmenities = require("./db/getUniqueAmenities");

module.exports = {
  jsonToArray,
  createReferenceTable,
  mapAdjustedData,
  mergeNames,
  arrangeArray,
  mapAmenities,
  getUniqueAmenities,
};
