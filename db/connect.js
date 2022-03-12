const {Pool} = require('pg');

const connection = new Pool({
  connectionString: process.env.DEV_DATABASE_URL,
  ssl: false,
});

module.exports = {connection};
