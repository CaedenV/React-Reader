const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyJWT = require('./verify');

router.post('/add', verifyJWT, async (req, res) => {
    const { sender, receiver, bookId } = req.body;
    try {
        let query = "insert into notifs (senderId, receiverId, bookId, notifRead) values (?,?,?, '0')";
        await db.queryDatabase(query, [sender, receiver, bookId]);
        return res.status(200).json({ success: true, message: "Recommendation Sent Successfully." });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: 'Something went wrong sending the recommendation. Please try again later.' });
    }
});

router.get('/getByUser', verifyJWT, async (req, res) => {
    const id = req.user;
    try {
        let query = 'SELECT notifs.senderId, books.title, notifs.notifRead FROM notifs JOIN books on notifs.bookId = books.id WHERE receiverId = ?';
        const results = await db.queryDatabase(query, [id]);
        if (results.length === 0) {
          return res.status(200).json({ success: true, notifs: [] });
        }
        return res.status(200).json({ success: true, notifs: results });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: 'Something went wrong retrieving notifications. Please try again later.' });
      }
});

router.get('/getNumByUser', verifyJWT, async (req, res) => {
    const id = req.user;
    try {
        let query = "select count(*) from notifs where receiverId = ?";
        const results = await db.queryDatabase(query, [id]);
        return res.status(200).json({ success: true, notifs: results[0] });
    } catch {
        return res.status(500).json({ success: false, message: 'Something went wrong retrieving notifications. Please try again later.' });
    }
})

router.patch('/read', verifyJWT, async (req, res) => {
    const { notifRead } = req.body;
    try {
        let query = "update notifs set notifRead = ? where receriverId = ?";
        const results = await db.queryDatabase(query, [notifRead, req.user]);
        if (results.affectedRows == 0) {
            return res.json({ success: false, message: "Notification not found." });
        }
        return res.status(200).json({ success: true, status: notifRead });
    } catch {
        return res.status(500).json({ success: false, message: 'Error occured updating the status. Please try again later.' });
    }
});

router.delete('/delete/:id', verifyJWT, async (req, res) => {
    const id = req.params.id;
    try {
        let query = "delete from notifs where id = ?";
        const results = await db.queryDatabase(query, [id]);
        if (results.affectedRows == 0) {
            return res.json({ success: false, message: "Notification not found." });
        }
        return res.status(200).json({ success: true, message: "Notification Deleted Successfully." });
    } catch {
        return res.status(500).json({ success: false, message: 'Error occured deleting the notification. Please try again later.' });
    }
});

module.exports = router;