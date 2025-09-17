const mapAdjustedData = require("../../utilities/db/mapAdjustedData");

const testRefTable = { "The Meadows": 1, "Hound Inn": 2 };
const testDataSingle = [
  { property_type: "Detached", owner: "Matthew", property_name: "The Meadows" },
];
const testDataMulti = [
  { property_type: "Detached", owner: "Matthew", property_name: "The Meadows" },
  { property_type: "Semi-Detached", owner: "Paul", property_name: "Hound Inn" },
];

describe("mapAdjustedData", () => {
  test("return an array", () => {
    expect(Array.isArray(mapAdjustedData())).toBe(true);
  });
  test("when passed data, return the same data if nothing requires changes", () => {
    expect(mapAdjustedData(testDataSingle)).toEqual([
      {
        property_type: "Detached",
        owner: "Matthew",
        property_name: "The Meadows",
      },
    ]);
  });
  test("when passed parameters, change that data but nothing else.", () => {
    expect(
      mapAdjustedData(
        testDataSingle,
        "property_name",
        "property_id",
        testRefTable
      )
    ).toEqual([
      {
        property_type: "Detached",
        owner: "Matthew",
        property_id: 1,
      },
    ]);
  });
  test("works for more than 1", () => {
    expect(
      mapAdjustedData(
        testDataMulti,
        "property_name",
        "property_id",
        testRefTable
      )
    ).toEqual([
      {
        property_type: "Detached",
        owner: "Matthew",
        property_id: 1,
      },
      {
        property_type: "Semi-Detached",
        owner: "Paul",
        property_id: 2,
      },
    ]);
  });
});
