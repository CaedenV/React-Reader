const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../server');

// Create the Hashed Password
const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

// Verify the JWT token
function protect(req, res, next) {
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
}

router.post('/register', async (req, res) => {
  const { userName, email, password } = req.body;
  console.log(req.body);
  if (!userName || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }
  const hashedPassword = hashPassword(password);
  var query = "select email, password from users where email = ?";
  try {
    const result = await db.query(query, [email]);
    if (result.length <= 0) {
      query = "insert into users (userName, email, password) values (?,?,?)";
      const results = await db.query(query, [userName, email, hashedPassword]);
      const token = jwt.sign({ id: results.insertId }, process.env.ACCESS_TOKEN, { expiresIn: '8h' });
      return res.status(200).json({ success: true, token: token });
    }
    else {
      return res.status(400).json({ success: false, message: 'Account already exists.' });
    }
  }
  catch (error) {
    return res.status(500).json({ success: false, message: 'Sorry, something went wrong. Please try again' });
  }
});

router.post('/login', (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Both email and password are required.' });
  }
  query = "select id, password from users where email = ?";
  try {
    const results = db.query(query, [email]);
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
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An error occured while checking credentials.' });
  }
});

router.get('/getAll', protect, (req, res) => {
  var query = "select id, userName, email from users";
  try {
    const results = db.query(query);
    return response.status(200).json(results);
  } catch {
    return res.status(500).json(err);
  }
});

router.get('/getUser', protect, (req, res) => {
  const { user } = req;
  var query = "select userName, pic, favGenre, nowRead from users where id = ?";
  try {
    const results = db.query(query, [user.id]);
    if (results.length <= 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return response.status(200).json({ success: true, user: results[0] });
  } catch {
    return res.status(500).json({ success: false, message: 'An error occured while fetching the user.' });
  }
});

router.patch('/update', protect, (req, res) => {
  let { user } = req;
  var query = "update user set pic=?,favGenre=?,nowRead=? where id=?";
  try {
    const results = db.query(query, [user.pic, user.favGenre, user.nowRead, user.id]);
    if (results.affectedRows == 0) {
      return res.status(404).json({ success: false, message: 'User Id does not exist.' });
    }
    return res.status(200).json({ success: true, message: 'User updated successfully' });
  } catch {
    return res.status(500).json({ success: false, message: 'An error occured while updating your profile.' });
  }
});

router.get('/libraries', protect, (req, res) => {
  const { user } = req;
  var ownedBooks;
  var wishedBooks;
  var favBooks;
  var query = "select bookId, bookRank from favbooks where id=?";
  try {
    const results = db.query(query, [user.id]);
    favBooks = results;
  } catch {
    return res.status(500).json({ success: false, message: 'An error occured while fetching your Favorite Books.' });
  }

  var query = "select bookId from ownedbooks where id=?";
  try {
    const results = db.query(query, [user.id]);
    ownedBooks = results;
  } catch {
    return res.status(500).json({ success: false, message: 'An error occured while fetching your Owned Books.' });
  }

  var query = "select bookId from wishedbooks where id=?";
  try {
    const results = db.query(query, [user.id]);
    wishedBooks = results;
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