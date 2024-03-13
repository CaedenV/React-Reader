const express = require('express');
const router = express.Router();
const db = require('../server');

router.post('/add', (req, res) => {
  let book = req.body;
  var query = "insert into books (cover, title, author, pubDate, genre, desc, avgRating, wordCount) values (?,?,?,?,?,?,?,?)";
  db.query(query, [book.cover, book.title, book.author, book.pubDate, book.genre, book.desc, book.avgRating, book.wordCount], (err, results) => {
    if (!err) {
      return res.status(200).json({ success: true, message: "Book Added Successfully." });
    }
    else {
      return res.status(500).json({ success: false, message: 'Error occured adding the book. Please try again later.' });
    }
  });
});

router.get('/getByParam/:sParam/:sQuery', (req, res) => {
  const param = req.params.sParam;
  const search = req.params.sQuery;

  let sql = `SELECT * FROM books WHERE ? = ?`;
  db.query(sql, [param, search], (err, results) => {
    if (!err) {
      return res.status(200).json({ success: true, books: results });
    }
    else {
      return res.status(500).json({ success: false, message: 'An error occured finding the results. Please try again later.' });
    }
  });
});

router.get('/getById/:id', (req, res) => {
  const id = req.params.id;
  var query = "select cover, title, author, pubDate, genre, desc, avgRating, wordCount from books where id = ?";
  db.query(query, [id], (err, results) => {
    if (!err) {
      return res.status(200).json({ success: true, book: results[0] });
    }
    else {
      return res.status(500).json({ success: false, message: 'An error occured getting the book. Please try again later.' });
    }
  });
});

export default router;