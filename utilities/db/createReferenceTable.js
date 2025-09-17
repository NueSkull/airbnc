function createReferenceTable(table, newKey, newValue) {
  let returnObj = {};
  table.forEach((row) => {
    returnObj[row[newKey]] = row[newValue];
  });
  return returnObj;
}

module.exports = createReferenceTable;
