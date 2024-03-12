const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');

router.post('/add', auth.authenticateToken, (req, res) => {
  let wish = req.body;
  query = "insert into wishedbooks (userId, bookId) values (?,?)";
  connection.query(query, [wish.userId, wish.bookId], (err, results) => {
    if (!err) {
      return res.status(200).json({ message: "Book Wished Successfully." });
    }
    else {
      return res.status(500).json(err);
    }
  });
})

router.get('/getByUser/:id', auth.authenticateToken, (req, res) => {
  const id = req.params.id;
  var query = "select bookId from wishedbooks where userId = ?";
  connection.query(query, [id], (err, results) => {
    if (!err) {
      return res.status(200).json(results);
    }
    else {
      return res.status(500).json(err);
    }
  });
});


module.exports = router;