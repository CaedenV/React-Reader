const express = require('express');
const db = require('../server');
const router = express.Router();

// Verify the JWT token
router.use((req, res, next) => {
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
});

router.post('/add', (req, res) => {
  let book = req.body;
  var query = "insert into ownedbooks (userId, bookId) values (?,?)";
  try {
    const results = db.query(query, [book.userId, book.bookId]);
    return res.status(200).json({ success: true, message: "Book Owned Successfully." });
  } catch {
    return res.status(500).json({ success: false, message: 'An error occured adding to your Owned Books. Please try again later.' });
  }
});

router.get('/getByUser/:id', (req, res) => {
  const id = req.params.id;
  var query = "select bookId from ownedbooks where userId = ?";
  try {
    const resultts = db.query(query, [id]);
    return res.status(200).json({ success: true, owned: results });
  } catch {
    return res.status(500).json({ success: false, message: 'An error occured getting your Owned Books. Please try again later.' });
  }
});

module.exports = router;