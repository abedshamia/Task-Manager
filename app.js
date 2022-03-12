require('dotenv').config();
const express = require('express');
const app = express();
const tasks = require('./routes/tasks');
const {connection} = require('./db/connect');
const PORT = process.env.PORT || 3000;

//Routes
app.use(express.json());

connection
  .connect()
  .then(() => {
    console.log('Connected to the database');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.log('Error connecting to the database', err);
  });

app.use(express.static('public'));

app.use('/api/v1/tasks', tasks);
