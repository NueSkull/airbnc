const mergeNames = require("../../utilities/db/mergeNames");

const singleData = [
  {
    user_id: 1,
    first_name: "Alice",
    surname: "Johnson",
    email: "alice@example.com",
  },
];

const multiData = [
  {
    user_id: 1,
    first_name: "Alice",
    surname: "Johnson",
    email: "alice@example.com",
  },
  {
    user_id: 2,
    first_name: "Bob",
    surname: "Smith",
    email: "bob@example.com",
  },
];

describe("mergeNames", () => {
  test("returns an array", () => {
    expect(Array.isArray(mergeNames([]))).toBe(true);
  });
  test("combine first and last name and leave the remaining data in tact, single ", () => {
    expect(mergeNames(singleData)).toEqual([
      { user_id: 1, name: "Alice Johnson", email: "alice@example.com" },
    ]);
  });
  test("same as multi", () => {
    expect(mergeNames(multiData)).toEqual([
      { user_id: 1, name: "Alice Johnson", email: "alice@example.com" },
      { user_id: 2, name: "Bob Smith", email: "bob@example.com" },
    ]);
  });
});
