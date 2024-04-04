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
      return res.status(500).json({ success: false, message: err.message });
    }
  }

router.post('/add', verifyJWT, async (req, res) => {
    const {friendName} = req.body;
    const userId = req.user;
    try {
        const friend = await getUserByUN(friendName);
        let query = "insert into friendusers (userId, friendId) values (?,?)";
        await db.queryDatabase(query, [userId, friend.id]);
        return res.status(200).json({ success: true, message: "Friend Added Successfully." });
    } catch (err){
        return res.status(500).json({ success: false, message: 'Error occured while adding friend. Please try again later.', error: err.message });
    }
});

router.get('/getUser', verifyJWT, async (req, res) => {
    const id = req.user;
    try {
        let query = "SELECT u.id, u.userName, u.pic FROM friendUsers f JOIN users u ON f.friendId = u.id WHERE f.userId = ? UNION SELECT u.id, u.userName, u.pic FROM friendUsers f JOIN users u ON f.userId = u.id WHERE f.friendId = ?";
        const results = await db.queryDatabase(query, [id, id]);
        return res.status(200).json({ success: true, friends: results });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Error occured when getting your friends. Please try again later.', error: err.message });
    }
});

router.get('/getOther/:name', verifyJWT, async (req, res) => {
    const {name} = req.params;
    try {
        let query = "select id from users where userName = ?";
        const results = await db.queryDatabase(query, [name]);
        let otherQ = "SELECT u.id, u.userName, u.pic FROM friendUsers f JOIN users u ON f.friendId = u.id WHERE f.userId = ? UNION SELECT u.id, u.userName, u.pic FROM friendUsers f JOIN users u ON f.userId = u.id WHERE f.friendId = ?";
        const friends = await db.queryDatabase(otherQ, [results[0].id, results[0].id]);
        return res.status(200).json({success: true, friends: friends});
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Error occured when getting your friends. Please try again later.', error: err.message });
    }
});

router.get('/getNum', verifyJWT, async (req, res) => {
    const id = req.user;
    try {
        let query = "SELECT count(*) FROM friendusers WHERE userId = ? OR friendId = ?";
        const results = await db.queryDatabase(query, [id, id]);
        const count = results[0]['count(*)'];
        return res.status(200).json({ success: true, num: count });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Error occured when getting your friends. Please try again later.', error: err.message });
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
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Error occured removing your friend. Please try again later.', error: err.message });
    }
})

module.exports = router;