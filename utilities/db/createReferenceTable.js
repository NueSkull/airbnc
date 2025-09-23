function createReferenceTable(table, newKey, newValue) {
  const returnObj = {};
  table.forEach((row) => {
    returnObj[row[newKey]] = row[newValue];
  });
  return returnObj;
}

module.exports = createReferenceTable;
