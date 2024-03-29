const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const verifyJWT = require('./verify');
const db = require('../db');
const multer = require('multer');
const upload = multer({dest: '/uploads'})
const fs = require('fs');

// Create the Hashed Password
const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

async function getUserByEmail(email) {
  try {
    const query = 'select userName, password, id from users where email = ?';
    const res = await db.queryDatabase(query, [email]);
    return res[0];
  }
  catch (err) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

router.post('/register', async (req, res) => {
  req.withCredentials = true;
  const { userName, email, password, pic } = req.body;
  console.log(pic);

  if (!userName || !email || !password) {
    console.log("Not all fields");
    return res.json({ success: false, message: 'All fields are required.' });
  }
  try {
    const exist = await getUserByEmail(email);
    if (exist) { return res.json({ success: false, message: 'Account already exists. Please sign in.' }); }

    const hashedPassword = hashPassword(password);
    let query = "insert into users (userName, email, password, pic) values (?,?,?,?)";
    const results = await db.queryDatabase(query, [userName, email, hashedPassword, pic]);
    const token = jwt.sign({ id: results[0].insertId }, process.env.ACCESS_TOKEN, { expiresIn: '3h' });
    return res.status(200).json({ success: true, message: "Login Successful!", token: token });
  }
  catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
});

router.post('/login', async (req, res) => {
  req.withCredentials = true;
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ success: false, message: 'Both email and password are required.' });
  }
  try {
    query = "select id, password from users where email = ?";
    const user = await getUserByEmail(email);
    if (!user) {
      return res.json({ success: false, message: 'Incorrect Email or Password.' });
    }

    bcrypt.compare(password, user.password, (err, match) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'An error occured while checking credentials.' });
      }
      if (!match) {
        return res.json({ success: false, message: 'Incorrect Email or Password.' });
      }
      const token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN, { expiresIn: '3h' });
      return res.status(200).json({ success: true, message: "Login Successful!", token: token });
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'An error occured while checking credentials.' });
  }
});

// Get all users
router.get('/getAll', verifyJWT, async (req, res) => {
  try {
    const query = "SELECT id, userName, email FROM users";
    const results = await db.queryDatabase(query);
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get self
router.get('/getMe', verifyJWT, async (req, res) => {
  const id = req.user;
  try {
    const query = "SELECT userName, pic, favGenre, nowRead FROM users WHERE id = ?";
    const results = await db.queryDatabase(query, [id]);
    if (results.length <= 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    const user = results[0];
    user.pic = `http://localhost:8080${results[0].pic}`;

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get specific user
router.get('/getUser', verifyJWT, async (req, res) => {
  const id = req.body;
  try {
    const query = "SELECT userName, pic, favGenre, nowRead FROM users WHERE id = ?";
    const results = await db.queryDatabase(query, [id]);
    if (results.length <= 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return res.status(200).json({ success: true, user: results[0] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

var type = upload.single('image');
// Update user profile
router.patch('/update', verifyJWT, type, async (req, res) => {
  const id = req.user;
  const {userName, favGenre} = req.body;

  if(req.file) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const newFName = req.file.originalname.replace('.','-' + uniqueSuffix + '.');
    fs.rename(req.file.path, `uploads/${newFName}`, function (err) {
      if(err) {return res.status(500).json({error: err.message, message: 'Something went wrong. Please try again later.'});}
    });

    const pic = `/uploads/${newFName}`;
    try {
      const query = "UPDATE users SET userName=?, pic=?, favGenre=? WHERE id=?";
      const results = await db.queryDatabase(query, [userName, pic, favGenre, id]);
      if (results.affectedRows === 0) {
        return res.json({ success: false, message: 'User ID does not exist.' });
      } 
      return res.json({ success: true, message: 'User updated successfully' });
    } catch (error) {
      return res.status(500).json({ error: error.message, message: 'Something went wrong. Please try again later.' });
    }
  }
  else {
    try {
      const query = "UPDATE users SET userName=?, favGenre=? WHERE id=?";
      const results = await db.queryDatabase(query, [userName, favGenre, id]);
      if (results.affectedRows === 0) {
        return res.json({ success: false, message: 'User ID does not exist.' });
      }
      return res.json({ success: true, message: 'User updated successfully' });
    } catch (error) {
      return res.status(500).json({ error: error.message, message: 'Something went wrong. Please try again later.' });
    }
  }
});
 
router.patch('/nowRead', verifyJWT, async (req, res) => {
  const id = req.user;
  const bookId = req.body;
  try {
    const query = "UPDATE users SET nowRead=? WHERE id=?";
    await db.queryDatabase(query, [bookId, id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User ID does not exist.' });
    }
    return res.status(200).json({ success: true, message: 'Successfully started reading' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Delete user profile
router.delete('/remove', verifyJWT, async (req, res) => {
  const userId = req.user;
  try {
    const query = "DELETE FROM users WHERE id = ?";
    const results = await db.queryDatabase(query, [userId]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User ID does not exist.' });
    }
    return res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get user's libraries
router.get('/libraries', verifyJWT, async (req, res) => {
  const id = req.user;
  try {
    const ownedBooksQuery = "SELECT bookId FROM ownedbooks WHERE userId=?";
    const wishedBooksQuery = "SELECT bookId FROM wishedbooks WHERE userId=?";
    const favBooksQuery = "SELECT bookId, bookRank FROM favbooks WHERE userId=?";

    const ownedBooks = await db.queryDatabase(ownedBooksQuery, [id]);
    const wishedBooks = await db.queryDatabase(wishedBooksQuery, [id]);
    const favBooks = await db.queryDatabase(favBooksQuery, [id]);

    const data = { owned: ownedBooks, wished: wishedBooks, faved: favBooks };
    return res.status(200).json({ success: true, library: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/selfLibCount', verifyJWT, async (req, res) => {
  const id = req.user;
  try {
    const ownedBooksQuery = "SELECT count(*) FROM ownedbooks WHERE userId=?";
    const wishedBooksQuery = "SELECT count(*) FROM wishedbooks WHERE userId=?";
    const favBooksQuery = "SELECT count(*) FROM favbooks WHERE userId=?";

    const ownNum = await db.queryDatabase(ownedBooksQuery, [id]);
    const wishNum = await db.queryDatabase(wishedBooksQuery, [id]);
    const favNum = await db.queryDatabase(favBooksQuery, [id]);

    const own = ownNum[0]['count(*)'];
    const wish = wishNum[0]['count(*)'];
    const fav = favNum[0]['count(*)'];

    const data = { owned: own, wished: wish, faved: fav };
    return res.status(200).json({ success: true, library: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;