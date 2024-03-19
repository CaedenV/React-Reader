const express = require('express');
const router = express.Router();
const db = require('../server');

router.post('/add', async (req, res) => {
  let book = req.body;
  var query = "insert into books (cover, title, author, pubDate, genre, desc, avgRating, wordCount) values (?,?,?,?,?,?,?,?)";
  try {
    const qRes = await new Promise((resolve, reject) => {
      db.query(query, [book.cover, book.title, book.author, book.pubDate, book.genre, book.desc, book.avgRating, book.wordCount], (err, res) => {
        if (err) { reject(err); } else { resolve(res); }
      });
    });
    return res.status(200).json({ success: true, message: "Book Added Successfully." });
  } catch {
    return res.status(500).json({ success: false, message: 'Error occured adding the book. Please try again later.' });
  }
});

router.get('/getByParam/:sParam/:sQuery', async (req, res) => {
  const param = req.params.sParam;
  const search = req.params.sQuery;

  let query = `SELECT * FROM books WHERE ? = ?`;
  try {
    const results = await new Promise((resolve, reject) => {
      db.query(query, [param, search], (err, res) => {
        if (err) { reject(err); } else { resolve(res); }
      });
    });
    if (results.count <= 0) {
      return res.status(404).json({ success: true, message: 'Sorry, no books found for ' + search + ' in ' + param + '.' })
    }
    return res.status(200).json({ success: true, message: 'Here are your results for ' + search + ' in ' + param + '.', books: results });
  } catch {
    return res.status(500).json({ success: false, message: 'An error occured finding the results. Please try again later.' });
  }
});

router.get('/getById/:id', async (req, res) => {
  const id = req.params.id;
  var query = "select cover, title, author, pubDate, genre, desc, avgRating, wordCount from books where id = ?";
  try {
    const results = await new Promise((resolve, reject) => {
      db.query(query, [id], (err, res) => {
        if (err) { reject(err); } else { resolve(res); }
      });
    });
    return res.status(200).json({ success: true, book: results[0] });
  } catch {
    return res.status(500).json({ success: false, message: 'An error occured getting the book. Please try again later.' });
  }
});

module.exports = router;;