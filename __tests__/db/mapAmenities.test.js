const mapAmenities = require("../../utilities/db/mapAmenities");

const sampleSingle = [
  {
    name: "Modern Apartment in City Center",
    property_type: "Apartment",
    location: "London, UK",
    price_per_night: 120.0,
    description: "Description of Modern Apartment in City Center.",
    host_name: "Alice Johnson",
    amenities: ["WiFi", "TV", "Kitchen"],
  },
];
const sampleMulti = [
  {
    name: "Modern Apartment in City Center",
    property_type: "Apartment",
    location: "London, UK",
    price_per_night: 120.0,
    description: "Description of Modern Apartment in City Center.",
    host_name: "Alice Johnson",
    amenities: ["WiFi", "TV", "Kitchen"],
  },
  {
    name: "Cosy Family House",
    property_type: "House",
    location: "Manchester, UK",
    price_per_night: 150.0,
    description: "Description of Cosy Family House.",
    host_name: "Alice Johnson",
    amenities: ["WiFi", "Parking", "Kitchen"],
  },
];

describe("mapAmenities", () => {
  test("return array", () => {
    expect(Array.isArray(mapAmenities())).toBe(true);
  });
  test("create a object containing key values pairs of, passed param 1 (name) and each of passed param 2 (amenity)", () => {
    expect(mapAmenities(sampleSingle, "name", "amenities")).toEqual([
      { "Modern Apartment in City Center": "WiFi" },
      { "Modern Apartment in City Center": "TV" },
      { "Modern Apartment in City Center": "Kitchen" },
    ]);
  });
  test("create multiple of above.", () => {
    expect(mapAmenities(sampleMulti, "name", "amenities")).toEqual([
      { "Modern Apartment in City Center": "WiFi" },
      { "Modern Apartment in City Center": "TV" },
      { "Modern Apartment in City Center": "Kitchen" },
      { "Cosy Family House": "WiFi" },
      { "Cosy Family House": "Parking" },
      { "Cosy Family House": "Kitchen" },
    ]);
  });
});
