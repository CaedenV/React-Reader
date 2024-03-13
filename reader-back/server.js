const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
require('dotenv').config();

import users from './routes/users';
import books from './routes/books';
import friends from './routes/friendUsers';
import favBooks from './routes/favBooks';
import owned from './routes/ownedBooks';
import wished from './routes/wishedBooks';
import notifs from './routes/notifs';
import revs from './routes/reviews';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/users', users);
app.use('/api/books', books);
app.use('/api/friends', friends);
app.use('/api/notifs', notifs);
app.use('/api/revs', revs);
app.use('/api/wished', wished);
app.use('/api/favs', favBooks);
app.use('/api/owned', owned);

const db = mysql.createConnection({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database.');
});

app.listen(3001, () => {
  console.log('Server is running on port 3001.');
});

module.exports = db;