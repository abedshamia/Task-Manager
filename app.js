require('dotenv').config();
const express = require('express');
const app = express();
const tasks = require('./routes/tasks');
const {connection} = require('./db/connect');
const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');
const PORT = process.env.PORT || 3000;
//Routes
app.use(express.static('public'));
app.use(express.json());
app.use('/api/v1/tasks', tasks);
app.use(notFound);
app.use(errorHandler);

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

//Global Error Handler
