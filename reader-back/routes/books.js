const express = require('express');
const router = express.Router();

router.post('/add', auth.authenticateToken, (req, res) => {
  let book = req.body;
  var query = "insert into books (cover, title, author, pubDate, genre, desc, avgRating, wordCount) values (?,?,?,?,?,?,?,?)";
  connection.query(query, [book.cover, book.title, book.author, book.pubDate, book.genre, book.desc, book.avgRating, book.wordCount], (err, results) => {
    if (!err) {
      return res.status(200).json({ message: "Book Added Successfully." });
    }
    else {
      return res.status(500).json(err);
    }
  });
})

router.get('/getByParam/:sParam/:sQuery', auth.authenticateToken, (req, res) => {
  const param = req.params.sParam;
  const search = req.params.sQuery;

  let sql = `SELECT * FROM books WHERE ? = ?`;
  connection.query(sql, [param, search], (err, results) => {
    if (!err)  {
      return res.status(200).json(results);
    }
    else {
      return res.status(500).json(err);
    }
  });
})

router.get('/getById/:id',auth.authenticateToken, (req, res) => {
  const id = req.params.id;
  var query = "select cover, title, author, pubDate, genre, desc, avgRating, wordCount from books where id = ?";
  connection.query(query, [id], (err, results) => {
      if (!err) {
          return res.status(200).json(results[0]);
      }
      else {
          return res.status(500).json(err);
      }
  });
})

export default router;