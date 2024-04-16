const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const db = require('./db');
const cors = require('cors');

const users = require('./routes/users');
const books = require('./routes/books');
const friends = require('./routes/friendUsers');
const favBooks = require('./routes/favBooks');
const owned = require('./routes/ownedBooks');
const wished = require('./routes/wishedBooks');
const notifs = require('./routes/notifs');
const revs = require('./routes/reviews');
const recs = requir('./routes/recommends');
const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // You should replace this with the deployed URL of your React application.
  credentials: true, // Allow credentials to enable cookies
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/users', users);
app.use('/books', books);
app.use('/friends', friends);
app.use('/notifs', notifs);
app.use('/revs', revs);
app.use('/wished', wished);
app.use('/favs', favBooks);
app.use('/owned', owned);
app.use('/recs', recs);
app.use('/uploads', express.static('uploads'));

app.listen(process.env.PORT, () => {
  console.log('Server is running on port ' + process.env.PORT + ".");
});