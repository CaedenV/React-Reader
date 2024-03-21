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
  } catch {
    return res.status(500).json({ success: false, message: 'An error occured getting adding to your Wished Books. Please try again later.' });
  }
});

router.delete('/remove', verifyJWT, async (req, res) => {
  const bookId = req.body;
  const userId = req.user;
  const query = "delete from wishedbooks where userId = ? and bookId = ?";
  try {
    const results = await db.queryDatabase(query, [userId, bookId]);
    if (results.affectedRows == 0) {
      return res.status(404).json({ success: false, message: 'Book not on the list.' });
    }
    return res.status(200).json({ success: true, message: 'Book removed successfully' });
  } catch {
    return res.status(500).json({ success: false, message: 'An error occured while removing your book.' });
  }
});

router.get('/getByUser/:id', verifyJWT, async (req, res) => {
  const id = req.user;
  const query = "select bookId from wishedbooks where userId = ?";
  try {
    const results = await db.queryDatabase(query, [id]);
    return res.status(200).json({ success: true, wished: results });
  } catch {
    return res.status(500).json({ success: false, message: 'An error occured getting your Wished Books. Please try again later.' });
  }
});

module.exports = router;