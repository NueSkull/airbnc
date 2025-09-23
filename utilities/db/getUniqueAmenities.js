function getUniqueAmenities(data) {
  const allAmenities = [];
  for (const property in data) {
    for (const item in data[property].amenities) {
      const currentItem = data[property].amenities[item];
      if (!allAmenities.includes(currentItem)) {
        allAmenities.push(currentItem);
      }
    }
  }

  const uniqueAmenities = allAmenities.map((amenity) => [amenity]);
  return uniqueAmenities;
}

module.exports = getUniqueAmenities;
