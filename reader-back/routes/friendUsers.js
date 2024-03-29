const express = require('express');
const db = require('../db');
const router = express.Router();
const verifyJWT = require('./verify');

async function getUserByUN(userName) {
    try {
      const query = 'select id from users where userName = ?';
      const res = await db.queryDatabase(query, [userName]);
      return res[0];
    }
    catch (err) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

router.post('/add', verifyJWT, async (req, res) => {
    const {friendName} = req.body;
    const userId = req.user;
    try {
        const friendId = getUserByUN(friendName);
        let query = "insert into friendusers (userId, friendId) values (?,?)";
        await db.queryDatabase(query, [userId, friendId]);
        return res.status(200).json({ success: true, message: "Friend Added Successfully." });
    } catch {
        return res.status(500).json({ success: false, message: 'Error occured while adding friend. Please try again later.' });
    }
});

router.get('/get', verifyJWT, async (req, res) => {
    const id = req.user;
    try {
        let query = "SELECT u.userName FROM friendusers f JOIN users u ON f.friendId = u.id WHERE f.userId = ?";
        const results = await db.queryDatabase(query, [id]);
        return res.status(200).json({ success: true, friends: results });
    } catch {
        return res.status(500).json({ success: false, message: 'Error occured when getting your friends. Please try again later.' });
    }
});

router.delete('/delete', verifyJWT, async (req, res) => {
    const {friendName} = req.body;
    const userId = req.user;
    try {
        const friendId = getUserByUN(friendName);

        let query = "delete from friendusers where userId = ? and friendId = ?";
        const results = await db.queryDatabase(query, [userId, friendId]);
        if (results.affectedRows == 0) {
            return res.status(404).json({ success: false, message: "Friend not found." });
        }
        return res.status(200).json({ success: true, message: "Friend Removed Successfully" });
    } catch {
        return res.status(500).json({ success: false, message: 'Error occured deleting your friend. Please try again later.' });
    }
})

module.exports = router;