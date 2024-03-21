const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/add', async (req, res) => {
  const { cover, title, author, pubDate, genre, desc, avgRating, wordCount } = req.body;
  try {
    let query = "insert into books (cover, title, author, pubDate, genre, desc, avgRating, wordCount) values (?,?,?,?,?,?,?,?)";
    await db.queryDatabase(query, [cover, title, author, pubDate, genre, desc, avgRating, wordCount]);
    return res.status(200).json({ success: true, message: "Book Added Successfully." });
  } catch {
    return res.status(500).json({ success: false, message: 'Error occured adding the book. Please try again later.' });
  }
});

router.get('/getByParam/:sParam/:sQuery', async (req, res) => {
  const param = req.params.sParam;
  const search = req.params.sQuery;
  try {
    let query = `SELECT * FROM books WHERE ? = ?`;
    const results = await db.queryDatabase(query, [param, search]);
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
  try {
    let query = "select cover, title, author, pubDate, genre, desc, avgRating, wordCount from books where id = ?";
    const results = await db.queryDatabase(query, [id]);
    return res.status(200).json({ success: true, book: results[0] });
  } catch {
    return res.status(500).json({ success: false, message: 'An error occured getting the book. Please try again later.' });
  }
});

module.exports = router;;