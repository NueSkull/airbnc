function arrangeArray(originalArray, order) {
  return originalArray.map((data) => {
    const returnObj = {};
    for (const newKey of order) {
      returnObj[newKey] = data[newKey];
    }
    return returnObj;
  });
}

module.exports = arrangeArray;
