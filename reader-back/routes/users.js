const express = require('express');
const connection = require('../connection');
const router = express.Router();
const image = require('../../src/assets/default');

const jwt = require('jsonwebtoken');
require('dotenv').config();
var auth = require('../services/authentication');
const bcrypt = require('bcryptjs');

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};


router.post('/register', (req, res) => {
  const { userName, password } = req.body;
  const hashedPassword = hashPassword(password);
  query = "select userName, password from users where userName =?"
  connection.query(query, [userName], (error, result) => {
    if (!error) {
      if (result.length <= 0) {
        query = "insert into users (userName, password, pic) values (?,?,?)";
        connection.query(query, [userName, hashedPassword, image], (err, results) => {
          if (!err) {
            return res.status(200).json({ message: "Successfully Registered." });
          }
          else {
            return res.status(500).json(err);
          }
        });
      }
      else {
        return res.status(400).json({ message: "Username already exists." })
      }
    }
    else {
      return res.status(500).json(error);
    }
  });
})

router.post('/login', (req, res) => {
  let user = req.body;
  query = "select userName, password from users where userName=?";
  connection.query(query, [user.userName], (err, result) => {
    if (!err) {
      if (results.length <= 0 || results[0].password != user.password) {
        return res.status(401).json({ message: "Incorrect Username or Password." });
      }
      else if (results[0].password == user.password) {
        const response = {
          userName: results[0].userName,
        };
        const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8h' })
        res.status(200).json({ token: accessToken });
      }
      else {
        return res.status(400).json({ message: "Something went wrong. Please try again later" });
      }
    }
    else {
      return res.status(500).json(err);
    }
  })
})

router.get('/get', auth.authenticateToken, (req, res) => {
  var query = "select id, userName, pic, favGenre, nowRead from users";
  connection.query(query, (err, results) => {
    if (!err) {
      return response.status(200).json(results);
    }
    else {
      return res.status(500).json(err);
    }
  });
})

router.get('/getById/:id', auth.authenticateToken, (req, res) => {
  const id = req.params.id;
  var query = "select userName, pic, favGenre, nowRead from users where id = ?";
  connection.query(query, [id], (err, results) => {
    if (!err) {
      return response.status(200).json(results[0]);
    }
    else {
      return res.status(500).json(err);
    }
  });
})

router.patch('/update', auth.authenticateToken, (req, res) => {
  let user = req.body;
  var query = "update user set pic=?,favGenre=?,nowRead=? where id=?";
  connection.query(query, [user.pic, user.favGenre, user.nowRead, user.id], (err, results) => {
    if (!err) {
      if (res.affectedRows == 0) {
        return res.status(404).json({ message: "User Id does not exist." });
      }
      return res.status(200).json({ message: "User updated successfully" });
    }
    else {
      return res.status(500).json(err);
    }
  });
})

router.get('/libraries/:id', auth.authenticateToken, (req, res, next) => {
  const id = req.params.id;
  var ownedBooks;
  var wishedBooks;
  var favBooks;
  var query = "select bookId, bookRank from favbooks where id=?";
  connection.query(query, [id], (err, results) => {
    if (!err) {
      favBooks = results;
    }
    else {
      return res.status(500).json(err);
    }
  });

  var query = "select bookId from ownedbooks where id=?";
  connection.query(query, [id], (err, results) => {
    if (!err) {
      ownedBooks = results;
    }
    else {
      return res.status(500).json(err);
    }
  });

  var query = "select bookId from wishedbooks where id=?";
  connection.query(query, [id], (err, results) => {
    if (!err) {
      wishedBooks = results;
      var data = {
        owned: ownedBooks,
        wished: wishedBooks,
        faved: favBooks
      };
      return res.status(200).json(data);
    }
    else {
      return res.status(500).json(err);
    }
  });
})

module.exports = router;;