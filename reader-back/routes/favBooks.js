const express = require('express');
const db = require('../db');
const router = express.Router();
const verifyJWT = require('./verify');

router.post('/add', verifyJWT, async (req, res) => {
  const fav = req.body;
  var query = "insert into favbooks (userId, bookId, bookRank) values (?,?,?)";
  try {
    await db.queryDatabase(query, [req.user, fav.bookId, fav.Rank]);
    return res.status(200).json({ success: true, message: "Book Favorited Successfully." });
  } catch {
    return res.status(500).json({ success: false, message: 'An error occured adding to your favorites. Please try again later.' });
  }
});


router.delete('/remove', verifyJWT, async (req, res) => {
  const { bookId } = req.body;
  const query = "delete from favbooks where userId = ? and bookId = ?";
  try {
    const results = await db.queryDatabase(query, [req.user, bookId]);
    if (results.affectedRows == 0) {
      return res.status(404).json({ success: false, message: 'Book not on the list.' });
    }
    return res.status(200).json({ success: true, message: 'Book removed successfully' });
  } catch {
    return res.status(500).json({ success: false, message: 'An error occured while removing your book.' });
  }
});

router.get('/getByUser/:id', verifyJWT, async (req, res) => {
  const query = "select bookId from favbooks where userId = ?";
  try {
    const results = await db.queryDatabase(query, [req.user]);
    return res.status(200).json({ success: true, wished: results });
  } catch {
    return res.status(500).json({ success: false, message: 'An error occured getting your favorite books. Please try again later.' });
  }
});

module.exports = router;