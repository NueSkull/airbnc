const makeJsonArray = require("../utilities/jsonToArray");

const examples = {
  singlesingle: [
    {
      property_type: "Apartment",
    },
  ],
  singledouble: [
    {
      property_type: "Apartment",
      description: "Description of Apartment.",
    },
  ],
  doublesingle: [
    {
      property_type: "Apartment",
    },
    {
      property_type: "House",
    },
  ],
  multiples: [
    {
      first_name: "Alice",
      surname: "Johnson",
      email: "alice@example.com",
    },
    {
      first_name: "Bob",
      surname: "Smith",
      email: "bob@example.com",
    },
  ],
};

describe("makeJsonArray", () => {
  test("returns an array", () => {
    expect(Array.isArray(makeJsonArray())).toBe(true);
  });
  test("takes an array with a an object with 1 key value pair and gives it back the value in an array", () => {
    expect(makeJsonArray(examples.singlesingle)).toEqual([["Apartment"]]);
  });
  test("expect new element not a mutation", () => {
    const originalValue = examples.singlesingle;
    const returnedValue = makeJsonArray(examples.singlesingle);
    expect(returnedValue).not.toBe(originalValue);
  });
  test("takes an array of two objects with 1 key value pair and gives back each values in an array, inside the outer array", () => {
    expect(makeJsonArray(examples.singledouble)).toEqual([
      ["Apartment", "Description of Apartment."],
    ]);
  });
  test("takes an array of a two objects with a key value pair and returns each in an array, within the outer array", () => {
    expect(makeJsonArray(examples.doublesingle)).toEqual([
      ["Apartment"],
      ["House"],
    ]);
  });
  test("takes multiple objects with multiple values", () => {
    expect(makeJsonArray(examples.multiples)).toEqual([
      ["Alice", "Johnson", "alice@example.com"],
      ["Bob", "Smith", "bob@example.com"],
    ]);
  });
});
