const express = require('express');
const db = require('../server');
const router = express.Router();

router.post('/add', async (req, res) => {
  let fav = req.body;
  var query = "insert into favbooks (userId, bookId, bookRank) values (?,?,?)";
  try {
    const results = await new Promise((resolve, reject) => {
      db.query(query, [fav.userId, fav.bookId, fav.Rank], (err, res) => {
        if (err) { reject(err); } else { resolve(res); }
      });
    });
    return res.status(200).json({ success: true, message: "Book Favorited Successfully." });
  } catch {
    return res.status(500).json({ success: false, message: 'An error occured adding to your favorites. Please try again later.' });
  }
});

router.delete('/remove', async (req, res) => {
  const { userId, bookId } = req;
  var query = "delete from favbooks where userId = ? and bookId = ?";
  try {
    const results = await new Promise((resolve, reject) => {
      db.query(query, [userId, bookId], (err, res) => {
        if (err) { reject(err); } else { resolve(res); }
      });
    });
    if (results.affectedRows == 0) {
      return res.status(404).json({ success: false, message: 'Book not on the list.' });
    }
    return res.status(200).json({ success: true, message: 'Book removed successfully' });
  } catch {
    return res.status(500).json({ success: false, message: 'An error occured while removing your book.' });
  }
});

router.get('/getByUser/:id', async (req, res) => {
  const id = req.params.id;
  var query = "select bookId, bookRank from favbooks where userId = ?";
  try {
    const results = await new Promise((resolve, reject) => {
      db.query(query, [id], (err, res) => {
        if (err) { reject(err); } else { resolve(res); }
      });
    });
    return res.status(200).json({ success: true, favs: results });
  } catch {
    return res.status(500).json({ success: false, message: 'An error occured getting your favorites. Please try again later.' });
  }
});


module.exports = router;