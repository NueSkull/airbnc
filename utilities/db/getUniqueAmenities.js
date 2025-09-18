function getUniqueAmenities(data) {
  let uniqueAmenities = [];
  for (const property in data) {
    for (const item in data[property].amenities) {
      const currentItem = data[property].amenities[item];
      if (!uniqueAmenities.includes(currentItem)) {
        uniqueAmenities.push(currentItem);
      }
    }
  }
  return uniqueAmenities;
}

module.exports = getUniqueAmenities;
