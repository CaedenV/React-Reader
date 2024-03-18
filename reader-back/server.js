const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const users = require('./routes/users');
const books = require('./routes/books');
const friends = require('./routes/friendUsers');
const favBooks = require('./routes/favBooks');
const owned = require('./routes/ownedBooks');
const wished = require('./routes/wishedBooks');
const notifs = require('./routes/notifs');
const revs = require('./routes/reviews');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database.');

  app.use('/users', users);
  app.use('/books', books);
  app.use('/friends', friends);
  app.use('/notifs', notifs);
  app.use('/revs', revs);
  app.use('/wished', wished);
  app.use('/favs', favBooks);
  app.use('/owned', owned);

  app.listen(process.env.PORT, () => {
    console.log('Server is running on port ' + process.env.PORT + ".");
  });
});



module.exports = db;