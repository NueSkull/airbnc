const createObjRef = require("../../utilities/db/createObjRef");

describe("createObjRef", () => {
  test("returns an array", () => {
    expect(Array.isArray(createObjRef([]))).toBe(true);
  });
  test("when passed parameters, replace the key with value, single obj", () => {});
  test.todo("as above but all other data should remain unchanged");
  test.todo("when passed parameters, replace the key with value, multi obj");
});
