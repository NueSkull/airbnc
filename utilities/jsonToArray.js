function makeJsonArray(data) {
  let array = new Array();

  for (let obj in data) {
    let valArray = new Array();
    for (let val in data[obj]) {
      valArray.push(data[obj][val]);
    }
    array.push(valArray);
  }
  console.log(array);
  return array;
}
module.exports = makeJsonArray;
