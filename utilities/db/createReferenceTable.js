function createReferenceTable(table, newKey, newValue) {
  let returnObj = {};
  table.forEach((row) => {
    returnObj[row[newKey]] = row[newValue];
  });
  console.log(returnObj);
  return returnObj;
}

module.exports = createReferenceTable;
