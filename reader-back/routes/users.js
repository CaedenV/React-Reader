const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../server');
require('dotenv').config();

// Create the Hashed Password
const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

// Verify the JWT token
router.use((req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Invalid token' });
  }
});

router.post('/register', (req, res) => {
  const { userName, email, password } = req.body;
  if (!userName || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }
  const hashedPassword = hashPassword(password);
  query = "select email, password from users where userName =?"
  db.query(query, [email], (error, result) => {
    if (!error) {
      if (result.length <= 0) {
        query = "insert into users (userName, email, password) values (?,?,?)";
        db.query(query, [userName, email, hashedPassword], (err, results) => {
          if (!err) {
            const token = jwt.sign({ id: results.insertId }, process.env.ACCESS_TOKEN, { expiresIn: '8h' });
            return res.status(200).json({ success: true, token: token });
          }
          else {
            return res.status(500).json({ success: false, message: 'Error occured. Please try again later.' });
          }
        });
      }
      else {
        return res.status(400).json({ success: false, message: 'Account already exists.' });
      }
    }
    else {
      return res.status(500).json({ success: false, message: 'Sorry, something went wrong. Please try again later.' });
    }
  });
})

router.post('/login', (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Both email and password are required.' });
  }
  query = "select id, password from users where email = ?";
  db.query(query, [email], (err, result) => {
    if (!err) {
      if (results.length <= 0) {
        return res.status(401).json({ success: false, message: 'Incorrect Email or Password.' });
      }
      bcrypt.compare(password, results[0].password, (err, match) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'An error occured while checking credentials.' });
        }
        if (!match) {
          return res.status(401).json({ success: false, message: 'Incorrect Email or Password.' });
        }
        const token = jwt.sign({ id: results[0].id }, process.env.ACCESS_TOKEN, { expiresIn: '8h' });
        return res.status(200).json({ success: true, token: token });
      });
    }
    else {
      return res.status(500).json({ success: false, message: 'An error occured while checking credentials.' });
    }
  });
});

router.get('/getAll', (req, res) => {
  var query = "select id, userName, email from users";
  db.query(query, (err, results) => {
    if (!err) {
      return response.status(200).json(results);
    }
    else {
      return res.status(500).json(err);
    }
  });
});

router.get('/getUser', (req, res) => {
  const { user } = req;
  var query = "select userName, pic, favGenre, nowRead from users where id = ?";
  db.query(query, [user.id], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'An error occured while fetching the user.' });
    }
    if (results.length <= 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return response.status(200).json({ success: true, user: results[0] });
  });
});

router.patch('/update', (req, res) => {
  let { user } = req;
  var query = "update user set pic=?,favGenre=?,nowRead=? where id=?";
  db.query(query, [user.pic, user.favGenre, user.nowRead, user.id], (err, results) => {
    if (!err) {
      if (res.affectedRows == 0) {
        return res.status(404).json({ success: false, message: 'User Id does not exist.' });
      }
      return res.status(200).json({ success: true, message: 'User updated successfully' });
    }
    else {
      return res.status(500).json({ success: false, message: 'An error occured while updating your profile.' });
    }
  });
});

router.get('/libraries', (req, res) => {
  const { user } = req;
  var ownedBooks;
  var wishedBooks;
  var favBooks;
  var query = "select bookId, bookRank from favbooks where id=?";
  db.query(query, [user.id], (err, results) => {
    if (!err) {
      favBooks = results;
    }
    else {
      return res.status(500).json({ success: false, message: 'An error occured while fetching your Favorite Books.' });
    }
  });

  var query = "select bookId from ownedbooks where id=?";
  db.query(query, [user.id], (err, results) => {
    if (!err) {
      ownedBooks = results;
    }
    else {
      return res.status(500).json({ success: false, message: 'An error occured while fetching your Owned Books.' });
    }
  });

  var query = "select bookId from wishedbooks where id=?";
  db.query(query, [user.id], (err, results) => {
    if (!err) {
      wishedBooks = results;
      var data = {
        owned: ownedBooks,
        wished: wishedBooks,
        faved: favBooks
      };
      return res.status(200).json({ success: true, library: data });
    }
    else {
      return res.status(500).json({ success: false, message: 'An error occured while fetching your Wished Books.' });
    }
  });
});

module.exports = router;;