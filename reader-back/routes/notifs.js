const express = require('express');
const db = require('../server');
const router = express.Router();

// Verify the JWT token
router.use((req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(400).json({ success: false, message: 'Invalid token' });
    }
});

router.post('/add', (req, res) => {
    let { notif } = req;
    var query = "insert into notifs (senderId, receiverId, bookId, notifRead) values (?,?,?, '0')";
    try {
        const results = db.query(query, [notif.sender, notif.receiver, notif.bookId]);
        return res.status(200).json({ success: true, message: "Recommendation Sent Successfully." });
    } catch {
        return res.status(500).json({ success: false, message: 'Something went wrong sending the recommendation. Please try again later.' });
    }
});

router.get('/getByUser', (req, res) => {
    const { user } = req;
    var query = "select senderId, bookId, notifRead from notifs where receiverId = ?";
    try {
        const results = db.query(query, [user.id]);
        return res.status(200).json({ success: true, notifs: results[0] });
    } catch {
        return res.status(500).json({ success: false, message: 'Something went wrong retrieving notifications. Please try again later.' });
    }
});

router.get('/getNumByUser', (req, res) => {
    const { user } = req;
    var query = "select count(*) from notifs where receiverId = ?";
    try {
        const results = db.query(query, [user.id]);
        return res.status(200).json({ success: true, notifs: results[0] });
    } catch {
        return res.status(500).json({ success: false, message: 'Something went wrong retrieving notifications. Please try again later.' });
    }
})

router.patch('/read', (req, res) => {
    const { notif } = req;
    var query = "update notifs set notifRead = ? where receriverId = ?";
    try {
        const results = db.query(query, [notif.notifRead, notif.userId]);
        if (results.affectedRows == 0) {
            return res.status(404).json({ success: false, message: "Notification not found." });
        }
        return res.status(200).json({ success: true, status: notif.notifRead });
    } catch {
        return res.status(500).json({ success: false, message: 'Error occured updating the status. Please try again later.' });
    }
});

router.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    var query = "delete from notifs where id = ?";
    try {
        const results = db.query(query, [id]);
        if (results.affectedRows == 0) {
            return res.status(404).json({ success: false, message: "Notification not found." });
        }
        return res.status(200).json({ success: true, message: "Notification Deleted Successfully." });
    } catch {
        return res.status(500).json({ success: false, message: 'Error occured deleting the notification. Please try again later.' });
    }
});

module.exports = router;