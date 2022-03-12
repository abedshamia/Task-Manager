require('dotenv').config();

const {NODE_ENV, DEV_DATABASE_URL, DATABASE_URL} = process.env;
const {Pool} = require('pg');
let URL;
let SSL;

switch (NODE_ENV) {
  case 'production':
    URL = DATABASE_URL;
    SSL = {rejectUnauthorized: false};
    break;
  case 'development':
    URL = DEV_DATABASE_URL;
    SSL = false;
    break;
  default:
    throw new Error({message: 'Error when connect DataBase'});
}

const connection = new Pool({
  connectionString: URL,
  ssl: SSL,
});

module.exports = {connection};
