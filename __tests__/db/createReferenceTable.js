const createReferenceTable = require("../../utilities/db/createReferenceTable");

const singleTestData = [{ property_id: 1, property_name: "Newland Inn" }];
const multiTestData = [
  { property_id: 1, property_name: "Newland Inn" },
  { property_id: 2, property_name: "The Meadows" },
];

describe("createReferenceTable", () => {
  test("returns an object", () => {
    expect(createReferenceTable([])).toEqual({});
  });
  test("when passed parameters, replace the key with value, single obj", () => {
    expect(
      createReferenceTable(singleTestData, "property_name", "property_id")
    ).toEqual({ "Newland Inn": 1 });
  });
  test("when passed parameters, replace the key with value, multi obj", () => {
    expect(
      createReferenceTable(multiTestData, "property_name", "property_id")
    ).toEqual({ "Newland Inn": 1, "The Meadows": 2 });
  });
});
