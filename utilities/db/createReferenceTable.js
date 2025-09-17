// function createRef(employees, key, value) {
//   let employeeMap = {};
//   for (let employee in employees) {
//     employeeMap[employees[employee][key]] = employees[employee][value];
//   }
//   return employeeMap;
// }

function createReferenceTable(table, newKey, newValue) {
  let returnObj = {};
  table.forEach((row) => {
    returnObj[row[newKey]] = row[newValue];
  });
  return returnObj;
}

module.exports = createReferenceTable;
