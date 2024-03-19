const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const db = require('./db');
var { expressjwt: jwt } = require("express-jwt");
var cookieParser = require('cookie-parser');

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
app.use(cookieParser(process.env.COOKIE_KEY));

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database.');

  app.use(
    jwt({
      secret: process.env.ACCESS_TOKEN,
      algorithms: ['HS256'],
      requestProperty: 'user',
      getToken: (req) => {
        console.log(req.cookies);
        const token = req.cookies.token;
        return token;
      }
    }).unless({ path: ['/users/login', '/users/register', '/books'] })
  );

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