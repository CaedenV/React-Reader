const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');

router.post('/add', auth.authenticateToken, (req, res) => {
    let notif = req.body;
    var query = "insert into notifs (senderId, receiverId, bookId, notifRead) values (?,?,?, '0')";
    connection.query(query, [notif.sender, notif.receiver, notif.bookId], (err, results) => {
        if (!err) {
            return res.status(200).json({ message: "Notif Posted Successfully." });
        }
        else {
            return res.status(500).json(err);
        }
    });
})

router.get('/getByUser/:id', auth.authenticateToken, (req, res) => {
    const id = req.params.id;
    var query = "select senderId, bookId, notifRead from notifs where receiverId = ?";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    });
})

router.patch('/read', auth.authenticateToken, (req, res, next) => {
    let notif = req.body;
    var query = "update notifs set notifRead = ? where receriverId = ?";
    connection.query(query, [notif.notifRead, notif.userId], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "Notif Id was not found." });
            }
            return res.status(200).json({ message: "Notif Read Successfully." });
        }
        else {
            return res.status(500).json(err);
        }
    });
})

router.delete('/delete/:id', auth.authenticateToken, (req, res, next) => {
    const id = req.params.id;
    var query = "delete from notifs where id = ?";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "Notif Id not found." });
            }
            return res.status(200).json({ message: "Notif Deleted Successfully." });
        }
        else {
            return res.status(500).json(err);
        }
    });
})

module.exports = router;