function mapAmenities(data, param1, param2) {
  const mapped = [];
  for (const property in data) {
    for (const item in data[property][param2]) {
      mapped.push({
        [param1]: data[property][param1],
        [param2]: data[property][param2][item],
      });
    }
  }
  return mapped;
}

module.exports = mapAmenities;
