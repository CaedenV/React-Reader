const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');

router.post('/add', auth.authenticateToken, (req, res) => {
    let friends = req.body;
    var query = "insert into friendusers (userId, friendId) values (?,?)";
    connection.query(query, [friends.userId, friends.friendId], (err, results) => {
        if (!err) {
            return res.status(200).json({ message: "Friend Added Successfully." });
        }
        else {
            return res.status(500).json(err);
        }
    });
})

router.get('/getById/:id', auth.authenticateToken, (req, res, next) => {
    const id = req.params.id;
    var query = "SELECT u.userName FROM friendusers f JOIN users u ON f.friendId = u.id WHERE f.userId = ?";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    });
})

router.delete('/delete', auth.authenticateToken, (req, res, next) => {
    const {userId, friendId} = req.body;
    var query = "delete from friendusers where userId = ? and friendId = ?";
    connection.query(query, [userId, friendId], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "Friend Id not found." });
            }
            return res.status(200).json({ message: "Friend Removed Successfully" });
        }
        else {
            return res.status(500).json(err);
        }
    });
})

module.exports = router;