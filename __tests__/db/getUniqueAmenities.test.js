const getUniqueAmenities = require("../../utilities/db/getUniqueAmenities");

const sampleAmenity = [
  {
    name: "Modern Apartment in City Center",
    host_name: "Alice Johnson",
    amenities: ["WiFi"],
  },
];
const sampleSingle = [
  {
    name: "Modern Apartment in City Center",
    host_name: "Alice Johnson",
    amenities: ["WiFi", "TV", "Kitchen"],
  },
];
const sampleDups = [
  {
    name: "Modern Apartment in City Center",
    host_name: "Alice Johnson",
    amenities: ["WiFi", "TV", "Kitchen", "WiFi"],
  },
];
const sampleMulti = [
  {
    name: "Modern Apartment in City Center",
    host_name: "Alice Johnson",
    amenities: ["WiFi", "TV", "Kitchen"],
  },
  {
    name: "Cosy Family House",
    host_name: "Alice Johnson",
    amenities: ["WiFi", "Parking", "Kitchen"],
  },
];

describe("getUniqueAmenities", () => {
  test("returns an array", () => {
    expect(Array.isArray(getUniqueAmenities())).toBe(true);
  });
  test("return only the amenity when passed 1", () => {
    expect(getUniqueAmenities(sampleAmenity)).toEqual([["WiFi"]]);
  });
  test("returns all the amenities in an array when given multiple", () => {
    expect(getUniqueAmenities(sampleSingle)).toEqual([
      ["WiFi"],
      ["TV"],
      ["Kitchen"],
    ]);
  });
  test("only returns unique amenities", () => {
    expect(getUniqueAmenities(sampleDups)).toEqual([
      ["WiFi"],
      ["TV"],
      ["Kitchen"],
    ]);
  });
  test("iterates over multiple objects", () => {
    expect(getUniqueAmenities(sampleMulti)).toEqual([
      ["WiFi"],
      ["TV"],
      ["Kitchen"],
      ["Parking"],
    ]);
  });
});
