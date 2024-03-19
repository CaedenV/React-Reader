const express = require('express');
const db = require('../server');
const router = express.Router();

router.post('/add', async (req, res) => {
    const { userId, friendId } = req;
    var query = "insert into friendusers (userId, friendId) values (?,?)";
    try {
        const results = await new Promise((resolve, reject) => {
            db.query(query, [userId, friendId], (err, res) => {
                if (err) { reject(err); } else { resolve(res); }
            });
        });
        return res.status(200).json({ success: true, message: "Friend Added Successfully." });
    } catch {
        return res.status(500).json({ success: false, message: 'Error occured while adding friend. Please try again later.' });
    }
});

router.get('/getById/:id', async (req, res, next) => {
    const id = req.params.id;
    var query = "SELECT u.userName FROM friendusers f JOIN users u ON f.friendId = u.id WHERE f.userId = ?";
    try {
        const results = await new Promise((resolve, reject) => {
            db.query(query, [id], (err, res) => {
                if (err) { reject(err); } else { resolve(res); }
            });
        });
        return res.status(200).json({ success: true, friends: results });
    } catch {
        return res.status(500).json({ success: false, message: 'Error occured when getting your friends. Please try again later.' });
    }
});

router.delete('/delete', async (req, res, next) => {
    const { userId, friendId } = req.body;
    var query = "delete from friendusers where userId = ? and friendId = ?";
    try {
        const results = await new Promise((resolve, reject) => {
            db.query(query, [userId, friendId], (err, res) => {
                if (err) { reject(err); } else { resolve(res); }
            });
        });
        if (results.affectedRows == 0) {
            return res.status(404).json({ success: false, message: "Friend not found." });
        }
        return res.status(200).json({ success: true, message: "Friend Removed Successfully" });
    } catch {
        return res.status(500).json({ success: false, message: 'Error occured deleting your friend. Please try again later.' });
    }
})

module.exports = router;