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
      { name: "Modern Apartment in City Center", amenities: "WiFi" },
      { name: "Modern Apartment in City Center", amenities: "TV" },
      { name: "Modern Apartment in City Center", amenities: "Kitchen" },
    ]);
  });
  test("create multiple of above.", () => {
    expect(mapAmenities(sampleMulti, "name", "amenities")).toEqual([
      { name: "Modern Apartment in City Center", amenities: "WiFi" },
      { name: "Modern Apartment in City Center", amenities: "TV" },
      { name: "Modern Apartment in City Center", amenities: "Kitchen" },
      { name: "Cosy Family House", amenities: "WiFi" },
      { name: "Cosy Family House", amenities: "Parking" },
      { name: "Cosy Family House", amenities: "Kitchen" },
    ]);
  });
});
