function mapAdjustedData(data, replacingKey, replaceWith, refTable) {
  const returningArray = [];
  for (const rows in data) {
    const returningObject = {};
    for (const key in data[rows]) {
      if (key === replacingKey) {
        returningObject[replaceWith] = refTable[data[rows][key]];
      } else {
        returningObject[key] = data[rows][key];
      }
    }
    returningArray.push(returningObject);
  }
  return returningArray;
}

module.exports = mapAdjustedData;
