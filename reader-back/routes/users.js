const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db');

// Create the Hashed Password
const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

router.post('/register', async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    console.log("Not all fields");
    return res.json({ success: false, message: 'All fields are required.' });
  }
  const hashedPassword = hashPassword(password);
  var query = "select userName, password from users where email = ?";
  try {
    console.log("In TRY");
    const result = await new Promise((resolve, reject) => {
      db.query(query, [email], (error, results) => {
        if (error) { reject(error); }
        else { resolve(results); }
      });
    });
    if (result.length <= 0) {
      console.log("In NOT FOUND");
      query = "insert into users (userName, email, password) values (?,?,?)";
      const insertedResults = await new Promise((resolve, reject) => {
        db.query(query, [userName, email, hashedPassword], (error, results) => {
          if (error) { reject(error); } else { resolve(results); }
        });
      });
      const token = jwt.sign({ id: insertedResults.insertId }, process.env.ACCESS_TOKEN, { expiresIn: '3h' });
      return res.status(200).json({ success: true, token: token });
    }
    else {
      return res.json({ success: false, message: 'Account already exists. Please sign in.' });
    }
  }
  catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ success: false, message: 'Both email and password are required.' });
  }
  query = "select id, password from users where email = ?";
  try {
    const results = await new Promise((resolve, reject) => {
      db.query(query, [email], (err, res) => {
        if (err) { reject(err); } else { resolve(res); }
      });
    });
    if (results.length <= 0) {
      return res.json({ success: false, message: 'Incorrect Email or Password.' });
    }
    bcrypt.compare(password, results[0].password, (err, match) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'An error occured while checking credentials.' });
      }
      if (!match) {
        console.log(results[0].password, password);
        return res.json({ success: false, message: 'Incorrect Email or Password.' });
      }
      const token = jwt.sign({ id: results[0].id }, process.env.ACCESS_TOKEN, { expiresIn: '3h' });
      return res.status(200).json({ success: true, token: token });
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An error occured while checking credentials.' });
  }
});

router.get('/getAll', async (req, res) => {
  var query = "select id, userName, email from users";
  try {
    const result = await new Promise((resolve, reject) => {
      db.query(query, (err, res) => {
        if (err) { reject(err); } else { resolve(res); }
      });
    });
    return response.status(200).json(results);
  } catch {
    return res.status(500).json(err);
  }
});

router.get('/getUser', async (req, res) => {
  const { user } = req;
  var query = "select userName, pic, favGenre, nowRead from users where id = ?";
  try {
    const results = await new Promise((resolve, reject) => {
      db.query(query, [user.id], (err, res) => {
        if (err) { reject(err); } else { resolve(res); }
      });
    });
    if (results.length <= 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return res.status(200).json({ success: true, user: users[0] });
  } catch {
    return res.status(500).json({ success: false, message: 'An error occured while fetching the user.' });
  }
});

router.patch('/update', async (req, res) => {
  let { user } = req;
  var query = "update user set pic=?,favGenre=?,nowRead=? where id=?";
  try {
    const results = await new Promise((resolve, reject) => {
      db.query(query, [user.pic, user.favGenre, user.nowRead, user.id], (err, res) => {
        if (err) { reject(err); } else { resolve(res); }
      });
    });
    if (results.affectedRows == 0) {
      return res.status(404).json({ success: false, message: 'User Id does not exist.' });
    }
    return res.status(200).json({ success: true, message: 'User updated successfully' });
  } catch {
    return res.status(500).json({ success: false, message: 'An error occured while updating your profile.' });
  }
});

router.delete('/remove', async (req, res) => {
  const userId = req;
  var query = "delete from users where id = ?";
  try {
    const results = await new Promise((resolve, reject) => {
      db.query(query, [userId], (err, res) => {
        if (err) { reject(err); } else { resolve(res); }
      });
    });
    if (results.affectedRows == 0) {
      return res.status(404).json({ success: false, message: 'User Id does not exist.' });
    }
    return res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch {
    return res.status(500).json({ success: false, message: 'An error occured while deleting your profile.' });
  }
});

router.get('/libraries', async (req, res) => {
  const { user } = req;
  var ownedBooks;
  var wishedBooks;
  var favBooks;
  var query = "select bookId, bookRank from favbooks where id=?";
  try {
    const qFav = await new Promise((resolve, reject) => {
      db.query(query, [user.id], (err, res) => {
        if (err) { reject(err); } else { resolve(res); }
      });
    });
    favBooks = qFav;
  } catch {
    return res.status(500).json({ success: false, message: 'An error occured while fetching your Favorite Books.' });
  }

  var query = "select bookId from ownedbooks where id=?";
  try {
    const qOwn = await new Promise((resolve, reject) => {
      db.query(query, [user.id], (err, res) => {
        if (err) { reject(err); } else { resolve(res); }
      });
    });
    ownedBooks = qOwn;
  } catch {
    return res.status(500).json({ success: false, message: 'An error occured while fetching your Owned Books.' });
  }

  var query = "select bookId from wishedbooks where id=?";
  try {
    const qWish = await new Promise((resolve, reject) => {
      db.query(query, [user.id], (err, res) => {
        if (err) { reject(err); } else { resolve(res); }
      });
    });
    wishedBooks = qWish;
    var data = {
      owned: ownedBooks,
      wished: wishedBooks,
      faved: favBooks
    };
    return res.status(200).json({ success: true, library: data });
  } catch {
    return res.status(500).json({ success: false, message: 'An error occured while fetching your Wished Books.' });
  }
});

module.exports = router;