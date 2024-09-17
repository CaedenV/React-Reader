const express = require('express');
const db = require('../db');
const router = express.Router();
const verifyJWT = require('./verify');

// ownedbook endpoint responsible for adding a book to the user's possession
router.post('/add', verifyJWT, async (req, res) => {
  const bookId = req.body;
  const userId = req.user;
  //const bookAdds = {location: 'epubcfi(/6/4!/4/1:0)', fontSize: 100};
  try {
    const query = "insert into ownedbooks (userId, bookId) values (?,?)";
    await db.queryDatabase(query, [userId, bookId]);
    return res.status(200).json({ success: true, message: "Book Owned Successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'An error occured getting adding to your Wished Books. Please try again later.', error: err.message });
  }
});

// Gets all the books owned by the user
router.get('/get', verifyJWT, async (req, res) => {
  const id = req.user;
  const query = "select bookId, bookExp from ownedbooks where userId = ?";
  try {
    const results = await db.queryDatabase(query, [id]);
    return res.status(200).json({ success: true, owned: results });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'An error occured getting your Wished Books. Please try again later.', error: err.message });
  }
});

// Get self nowRead
router.get('/nowRead', verifyJWT, async (req, res) => {
  const id = req.user;
  try {
    const query = "SELECT nowRead FROM users WHERE id = ?";
    const results = await db.queryDatabase(query, [id]);
    if (results.length <= 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    const nowReadId = results[0].nowRead;
    const url = `http://localhost:8080/bookFiles/${nowReadId}.epub`;

    const bookQ = "SELECT bookAdds FROM ownedbooks WHERE userId = ? and bookId = ?";
    const bookRes = await db.queryDatabase(bookQ, [id, nowReadId]);
    if (bookRes.length <= 0) {
      return res.status(404).json({ success: false, message: 'Book not found.' });
    }
    const bookAdds = bookRes[0].bookAdds;


    return res.status(200).json({
      success: true,
      nowReadId: nowReadId,
      nowReadUrl: url,
      adds: bookAdds
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// updates the additional information tied to the book i.e. reading progress, font/style changes
router.patch('/bookAdds/:bookId', verifyJWT, async (req, res) => {
  const adds = req.body.bookAdds;
  const { bookId } = req.params;
  //console.log(bookId, req.user);
  const addJSON = JSON.stringify(adds);
  try {
    const updateQ = "UPDATE ownedbooks SET bookAdds = ? WHERE bookId = ? AND userId = ?";
    const results = await db.queryDatabase(updateQ, [addJSON, bookId, req.user]);
    if (results.affectedRows === 0) {
      return res.status(500).json({ success: false, message: "Book Adds not found." });
    }
    return res.status(200).json({ success: true, message: 'Book Adds updated successfully!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// loans a copy of the user's book to others -- new row in table containing expiration & updates active loans from user
router.post('/loan/:bookId', verifyJWT, async (req, res) => {
  const { loanTo, loanLength } = req.body;
  const { bookId } = req.params;
  let loanNumQ = 'SELECT bookLoans, bookExp from ownedbooks where bookId = ? and userId = ?';
  try {
    const loanQRes = await db.queryDatabase(loanNumQ, [bookId, req.user]);
    const loanNum = loanQRes[0].bookLoans;
  
    if (loanTo.length > 8 || (loanNum + loanTo.length > 8)) {
      return res.json({ success: false, message: "Book recipients exceeds 8 people" });
    }
    if(loanQRes[0].bookExp) {
      return res.json({success: false, message: "You don't fully own this title."})
    }
    if(loanLength) {

    }


  } catch (error) {
    return res.status(500).json({success: false, error: error.message})
  }
  


})

module.exports = router;