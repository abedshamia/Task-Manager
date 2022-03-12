const fs = require('fs');
const {connection} = require('./connect');
const buildSQL = fs.readFileSync('./db/build.sql', 'utf8');

connection.query(buildSQL, (err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Database build complete.');
  }
});

connection.end();
