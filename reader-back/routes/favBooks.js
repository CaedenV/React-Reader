const express = require('express');
const db = require('../db');
const router = express.Router();
const verifyJWT = require('./verify');

router.post('/add', verifyJWT, async (req, res) => {
  const fav = req.body.book;
  var query = "insert into favbooks (userId, bookId, bookRank) values (?,?,?)";
  try {
    await db.queryDatabase(query, [req.user, fav.bookId, fav.rank]);
    return res.status(200).json({ success: true, message: "Book Favorited Successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'An error occured adding to your favorites. Please try again later.', error: err.message });
  }
});


router.delete('/remove/:bookId', verifyJWT, async (req, res) => {
  const {bookId} = req.params;
  console.log(bookId);
  const query = "delete from favbooks where userId = ? and bookId = ?";
  try {
    const results = await db.queryDatabase(query, [req.user, bookId]);
    if (results.affectedRows == 0) {
      return res.status(404).json({ success: false, message: 'Book not on the list.' });
    }
    return res.status(200).json({ success: true, message: 'Book removed successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'An error occured while removing your book.', error: err.message });
  }
});

router.get('/getByUser/:id', verifyJWT, async (req, res) => {
  const query = "select bookId from favbooks where userId = ?";
  try {
    const results = await db.queryDatabase(query, [req.user]);
    return res.status(200).json({ success: true, wished: results });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'An error occured getting your favorite books. Please try again later.', error: err.message });
  }
});

module.exports = router;