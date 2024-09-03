const express = require('express');
const db = require('../db');
const router = express.Router();
const verifyJWT = require('./verify');

router.post('/add', verifyJWT, async (req, res) => {
  const bookId = req.body;
  const userId = req.user;
  try {
    const query = "insert into ownedbooks (userId, bookId) values (?,?)";
    await db.queryDatabase(query, [userId, bookId]);
    return res.status(200).json({ success: true, message: "Book Owned Successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'An error occured getting adding to your Wished Books. Please try again later.', error: err.message });
  }
});

router.delete('/remove', verifyJWT, async (req, res) => {
  const bookId = req.body;
  const userId = req.user;
  const query = "delete from ownedbooks where userId = ? and bookId = ?";
  try {
    const results = await db.queryDatabase(query, [userId, bookId]);
    if (results.affectedRows == 0) {
      return res.status(404).json({ success: false, message: 'Book not on the list.' });
    }
    return res.status(200).json({ success: true, message: 'Book removed successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'An error occured while removing your book.', error: err.message });
  }
});

router.get('/get', verifyJWT, async (req, res) => {
  const id = req.user;
  const query = "select bookId from ownedbooks where userId = ?";
  try {
    const results = await db.queryDatabase(query, [id]);
    return res.status(200).json({ success: true, owned: results });
  } catch(err) {
    return res.status(500).json({ success: false, message: 'An error occured getting your Wished Books. Please try again later.', error: err.message });
  }
});

// Get self nowRead
router.get('/nowRead', verifyJWT, async(req, res) => {
  const id = req.user;
  try {
    const query = "SELECT nowRead FROM users WHERE id = ?";
    const results = await db.queryDatabase(query, [id]);
    if (results.length <= 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    const nowReadId = results[0].nowRead;
    const nowReadFN = `http://localhost:8080/books/${nowReadId}`;
    //console.log(nowRead);
    return res.status(200).json({success: true, nowRead: nowReadFN });
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
});

module.exports = router;