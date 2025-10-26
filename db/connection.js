const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || "dev";

require("dotenv").config({ path: `${__dirname}/../.env.${ENV}` });

// if (process.env.PGDATABASE === undefined) {
//   throw new Error("Set database environment in .env");
// }

const config = {};

if (ENV === "prod") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}

const pool = new Pool(config);

module.exports = pool;
