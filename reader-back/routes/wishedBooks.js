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
  query = "insert into wishedbooks (userId, bookId) values (?,?)";
  try {
    const results = db.query(query, [book.userId, book.bookId]);
    return res.status(200).json({ success: true, message: "Book Wished Successfully." });
  } catch {
    return res.status(500).json({ success: false, message: 'An error occured getting adding to your Wished Books. Please try again later.' });
  }
});

router.get('/getByUser/:id', (req, res) => {
  const id = req.params.id;
  var query = "select bookId from wishedbooks where userId = ?";
  try {
    const resultts = db.query(query, [id]);
    return res.status(200).json({ success: true, wished: results });
  } catch {
    return res.status(500).json({ success: false, message: 'An error occured getting your Wished Books. Please try again later.' });
  }
});

module.exports = router;