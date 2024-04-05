const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyJWT = require('./verify');

async function getUserById(id) {
    try {
        const query = 'select id, pic, userName from users where id = ?';
        const res = await db.queryDatabase(query, [id]);
        return res[0];
    }
    catch (err) {
        return err.message;
    }
}

async function getUserIdByName(name) {
    try {
        const query = 'select id from users where userName = ?';
        const res = await db.queryDatabase(query, [name]);
        return res[0];
    }
    catch (err) {
        return err.message;
    }
}

router.post('/sendBook', verifyJWT, async (req, res) => {
    const { data } = req.body;
    const book = data.book;
    const friendId = data.friend;
    const sender = await getUserById(req.user);
    sender.accept = false;
    //sender is always user. 
    try {
        let query = "insert into notifs (senderId, receiverId, book, friendRequest, notifType) values (?,?,?,?, 'book')";
        await db.queryDatabase(query, [req.user, friendId, JSON.stringify(book), JSON.stringify(sender)]);
        return res.status(200).json({ success: true, message: "Sent!" });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Something went wrong sending the recommendation. Please try again later.', error: err.message });
    }
});

router.post('/sendFriend', verifyJWT, async (req, res) => {
    const receiverName = req.body.friendName;
    const receiver = await getUserIdByName(receiverName);
    const sender = await getUserById(req.user);
    sender.accept = false;
    try {
        let query = "insert into notifs (senderId, receiverId, friendRequest, notifType) values (?,?,?, 'friend')";
        await db.queryDatabase(query, [sender.id, receiver.id, JSON.stringify(sender)]);
        return res.status(200).json({ success: true, message: "Recommendation Sent Successfully." });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Something went wrong sending the recommendation. Please try again later.', error: err.message });
    }
});

router.get('/getByUser', verifyJWT, async (req, res) => {
    const id = req.user;
    try {
        let bQuery = "SELECT id, senderId, createdAt, notifRead, book, friendRequest, notifType FROM notifs WHERE receiverId = ? AND notifType = 'book' order by createdAt ASC";
        let fQuery = "SELECT id, senderId, createdAt, notifRead, friendRequest, notifType FROM notifs WHERE receiverId = ? AND notifType = 'friend' order by createdAt ASC";
        let sQuery = "SELECT id, createdAt, notifRead, message, notifType FROM notifs WHERE receiverId = ? AND notifType = 'sys' order by createdAt ASC";
        const recs = await db.queryDatabase(bQuery, [id]);
        const friends = await db.queryDatabase(fQuery, [id]);
        const sys = await db.queryDatabase(sQuery, [id]);

        const results = { recs: recs, friendReq: friends, sysMessage: sys };

        return res.status(200).json({ success: true, notifs: results });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Something went wrong retrieving notifications. Please try again later.', error: err.message });
    }
});

router.get('/getNumByUser', verifyJWT, async (req, res) => {
    const id = req.user;
    try {
        let query = "select count(*) from notifs where receiverId = ? AND notifRead = 1";
        const results = await db.queryDatabase(query, [id]);
        const count = results[0]['count(*)'];
        return res.status(200).json({ success: true, notifs: count });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Something went wrong retrieving notifications. Please try again later.', error: err.message });
    }
});

router.get('/checkFReq/:receiverId', verifyJWT, async(req, res) => {
    const receiver = req.params;
    try {
        let query = "select id from notifs where notifType='friend' and senderId=? and receiverId=?";
        const results = await db.queryDatabase(query, [req.user, receiver]);
        if (results.id) {
            return res.status(200).json({ success: true, found: true });
        }
        else {
            return res.status(200).json({ success: true, found: false });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Something went wrong retrieving notification. Please try again later.', error: err.message });
    }
});

router.patch('/read/:id', verifyJWT, async (req, res) => {
    const { notifRead } = req.body;
    const { id } = req.params;
    try {
        let query = "update notifs set notifRead = ? where id = ? ";
        const results = await db.queryDatabase(query, [notifRead, id]);
        if (results.affectedRows == 0) {
            return res.json({ success: false, message: "Notification not found." });
        }
        return res.status(200).json({ success: true, status: notifRead });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Error occured updating the status. Please try again later.', error: err });
    }
});
router.patch('/acceptFriend/:id', verifyJWT, async (req, res) => {
    const { id } = req.params;
    const { friend } = req.body;
    try {
        let query = "update notifs set friendRequest=? where id = ? ";
        const results = await db.queryDatabase(query, [JSON.stringify(friend), id]);
        if (results.affectedRows == 0) {
            return res.json({ success: false, message: "Notification not found." });
        }
        return res.status(200).json({ success: true, message: "Friend request accepted" });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Error occured updating the status. Please try again later.', error: err });
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