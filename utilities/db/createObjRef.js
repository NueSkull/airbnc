// function createRef(employees, key, value) {
//   let employeeMap = {};
//   for (let employee in employees) {
//     employeeMap[employees[employee][key]] = employees[employee][value];
//   }
//   return employeeMap;
// }

function createObjRef(original, reference, replaceKey, keyReplaced) {
  return original.map((data) => {
    let returnObj = {};
    for (const [key, value] of Object.entries(data)) {
      returnObj[data[key]] = data[value];
    }
    return returnObj;
  });
}

module.exports = createObjRef;
