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
    db.query(query, [notif.sender, notif.receiver, notif.bookId], (err, results) => {
        if (!err) {
            return res.status(200).json({ success: true, message: "Recommendation Sent Successfully." });
        }
        else {
            return res.status(500).json({ success: false, message: 'Something went wrong sending the recommendation. Please try again later.' });
        }
    });
});

router.get('/getByUser', (req, res) => {
    const { user } = req;
    var query = "select senderId, bookId, notifRead from notifs where receiverId = ?";
    db.query(query, [user.id], (err, results) => {
        if (!err) {
            return res.status(200).json({ success: true, notifs: results[0] });
        }
        else {
            return res.status(500).json({ success: false, message: 'Something went wrong retrieving notifications. Please try again later.' });
        }
    });
});
router.get('/getNumByUser', (req, res) => {
    const { user } = req;
    var query = "select count(*) from notifs where receiverId = ?";
    db.query(query, [user.id], (err, results) => {
        if (!err) {
            return res.status(200).json({ success: true, notifs: results[0] });
        }
        else {
            return res.status(500).json({ success: false, message: 'Something went wrong retrieving notifications. Please try again later.' });
        }
    });
})

router.patch('/read', (req, res, next) => {
    const { notif } = req;
    var query = "update notifs set notifRead = ? where receriverId = ?";
    db.query(query, [notif.notifRead, notif.userId], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ success: false, message: "Notification not found." });
            }
            return res.status(200).json({ success: true, status: notif.notifRead });
        }
        else {
            return res.status(500).json({ success: false, message: 'Error occured updating the status. Please try again later.' });
        }
    });
});

router.delete('/delete/:id', (req, res, next) => {
    const id = req.params.id;
    var query = "delete from notifs where id = ?";
    db.query(query, [id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ success: false, message: "Notification not found." });
            }
            return res.status(200).json({ success: true, message: "Notification Deleted Successfully." });
        }
        else {
            return res.status(500).json({ success: false, message: 'Error occured deleting the notification. Please try again later.' });
        }
    });
});

module.exports = router;