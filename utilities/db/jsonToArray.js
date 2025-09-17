function makeJsonArray(data) {
  let rows = new Array();

  for (let obj in data) {
    rows.push(Object.values(data[obj]));
  }
  return rows;
}

module.exports = makeJsonArray;
