const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');

router.post('/add', auth.authenticateToken, (req, res) => {
  let rev = req.body;
  var query = "insert into reviews (bookId, rating, title, text) values (?,?,?,?)";
  connection.query(query, [rev.bookId, rev.rating, rev.title, rev.text], (err, results) => {
      if (!err) {
          return res.status(200).json({ message: "Review Added Successfully." });
      }
      else {
          return res.status(500).json(err);
      }
  });
})

router.get('/getByBook/:id', (req, res) => {
  const id = req.params.id;
    var query = "select rating, title, text from reviews where bookId = ?";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    });
})

module.exports = router;