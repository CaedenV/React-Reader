const express = require('express');
const db = require('../server');
const router = express.Router();

router.post('/add', async (req, res) => {
    let { notif } = req;
    var query = "insert into notifs (senderId, receiverId, bookId, notifRead) values (?,?,?, '0')";
    try {
        const results = await new Promise((resolve, reject) => {
            db.query(query, [notif.sender, notif.receiver, notif.bookId], (err, res) => {
                if (err) { reject(err); } else { resolve(res); }
            });
        });
        return res.status(200).json({ success: true, message: "Recommendation Sent Successfully." });
    } catch {
        return res.status(500).json({ success: false, message: 'Something went wrong sending the recommendation. Please try again later.' });
    }
});

router.get('/getByUser', async (req, res) => {
    const { user } = req;
    var query = "select senderId, bookId, notifRead from notifs where receiverId = ?";
    try {
        const results = await new Promise((resolve, reject) => {
            db.query(query, [user.id], (err, res) => {
                if (err) { reject(err); } else { resolve(res); }
            });
        });
        return res.status(200).json({ success: true, notifs: results[0] });
    } catch {
        return res.status(500).json({ success: false, message: 'Something went wrong retrieving notifications. Please try again later.' });
    }
});

router.get('/getNumByUser', async (req, res) => {
    const { user } = req;
    var query = "select count(*) from notifs where receiverId = ?";
    try {
        const results = await new Promise((resolve, reject) => {
            db.query(query, [user.id], (err, res) => {
                if (err) { reject(err); } else { resolve(res); }
            });
        });
        return res.status(200).json({ success: true, notifs: results[0] });
    } catch {
        return res.status(500).json({ success: false, message: 'Something went wrong retrieving notifications. Please try again later.' });
    }
})

router.patch('/read', async (req, res) => {
    const { notif } = req;
    var query = "update notifs set notifRead = ? where receriverId = ?";
    try {
        const results = await new Promise((resolve, reject) => {
            db.query(query, [notif.notifRead, notif.userId], (err, res) => {
                if (err) { reject(err); } else { resolve(res); }
            });
        });
        if (results.affectedRows == 0) {
            return res.json({ success: false, message: "Notification not found." });
        }
        return res.status(200).json({ success: true, status: notif.notifRead });
    } catch {
        return res.status(500).json({ success: false, message: 'Error occured updating the status. Please try again later.' });
    }
});

router.delete('/delete/:id', async (req, res) => {
    const id = req.params.id;
    var query = "delete from notifs where id = ?";
    try {
        const results = await new Promise((resolve, reject) => {
            db.query(query, [id], (err, res) => {
                if (err) { reject(err); } else { resolve(res); }
            });
        });
        if (results.affectedRows == 0) {
            return res.json({ success: false, message: "Notification not found." });
        }
        return res.status(200).json({ success: true, message: "Notification Deleted Successfully." });
    } catch {
        return res.status(500).json({ success: false, message: 'Error occured deleting the notification. Please try again later.' });
    }
});

module.exports = router;