const ENV = process.env.NODE_ENV;

console.log(ENV);

const devData = require("./dev");
const testData = require("./test");

const data = {
  test: testData,
  dev: devData,
  prod: devData,
};

module.exports = data[ENV];
