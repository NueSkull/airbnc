const arrangeArray = require("../utilities/arrangeArray");

const sampleSingle = [{ name: "Frank", age: "32", location: "Manchester" }];
const sampleMulti = [
  { name: "Lenny", age: "27", location: "Leeds" },
  { name: "Alfred", age: "84", location: "Birmingham" },
  { name: "Elizabeth", age: "42", location: "Liverpool" },
];

describe("arrangeArray", () => {
  test("returns an array", () => {
    expect(Array.isArray(arrangeArray([]))).toBe(true);
  });
  test("when passed an array and a single key, returns only that key", () => {
    expect(arrangeArray(sampleSingle, ["name"])).toEqual([{ name: "Frank" }]);
  });
  test("ensure that the return array is a new element, not mutated of original", () => {
    const returnedValue = arrangeArray(sampleSingle, ["name"]);
    expect(returnedValue).not.toBe(sampleSingle);
  });
  test("when passed an array and a bunch of keys, returns an obj with those keys in that order.", () => {
    expect(arrangeArray(sampleSingle, ["name", "location"])).toEqual([
      { name: "Frank", location: "Manchester" },
    ]);
  });
  test("works for multiple objects in the array", () => {
    expect(arrangeArray(sampleMulti, ["age", "name"])).toEqual([
      {
        age: "27",
        name: "Lenny",
      },
      {
        age: "84",
        name: "Alfred",
      },
      {
        age: "42",
        name: "Elizabeth",
      },
    ]);
  });
});
