const { Pool } = require("pg");

require("dotenv").config();

if (process.env.PGDATABASE === undefined) {
  throw new Error("Set database environment in .env");
}

const pool = new Pool();

module.exports = pool;
