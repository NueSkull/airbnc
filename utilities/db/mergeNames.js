function mergeNames(table) {
  const returningArray = [];
  for (const rows in table) {
    const returningObject = {};
    let firstName = "";
    let surname = "";
    for (const key in table[rows]) {
      if (key === "first_name") {
        firstName = table[rows][key];
      } else if (key === "surname") {
        surname = table[rows][key];
      } else {
        returningObject[key] = table[rows][key];
      }
    }
    returningObject.name = firstName + " " + surname;
    returningArray.push(returningObject);
  }
  return returningArray;
}

module.exports = mergeNames;
