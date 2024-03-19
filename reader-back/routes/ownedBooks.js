const express = require('express');
const db = require('../server');
const router = express.Router();

router.post('/add', async (req, res) => {
  let book = req.body;
  var query = "insert into ownedbooks (userId, bookId) values (?,?)";
  try {
    const results = await new Promise((resolve, reject) => {
      db.query(query, [book.userId, book.bookId], (err, res) => {
        if (err) { reject(err); } else { resolve(res); }
      });
    });
    return res.status(200).json({ success: true, message: "Book Owned Successfully." });
  } catch {
    return res.status(500).json({ success: false, message: 'An error occured adding to your Owned Books. Please try again later.' });
  }
});

router.delete('/remove', async (req, res) => {
  const { userId, bookId } = req;
  var query = "delete from ownedbooks where userId = ? and bookId = ?";
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
  var query = "select bookId from ownedbooks where userId = ?";
  try {
    const results = await new Promise((resolve, reject) => {
      db.query(query, [id], (err, res) => {
        if (err) { reject(err); } else { resolve(res); }
      });
    });
    return res.status(200).json({ success: true, owned: results });
  } catch {
    return res.status(500).json({ success: false, message: 'An error occured getting your Owned Books. Please try again later.' });
  }
});

module.exports = router;