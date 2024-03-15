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
    let { friends } = req;
    var query = "insert into friendusers (userId, friendId) values (?,?)";
    try {
        const results = db.query(query, [friends.userId, friends.friendId]);
        return res.status(200).json({ success: true, message: "Friend Added Successfully." });
    } catch {
        return res.status(500).json({ success: false, message: 'Error occured while adding friend. Please try again later.' });
    }
});

router.get('/getById/:id', (req, res, next) => {
    const id = req.params.id;
    var query = "SELECT u.userName FROM friendusers f JOIN users u ON f.friendId = u.id WHERE f.userId = ?";
    try {
        const results = db.query(query, [id]);
        return res.status(200).json({ success: true, friends: results });
    } catch {
        return res.status(500).json({ success: false, message: 'Error occured when getting your friends. Please try again later.' });
    }
});

router.delete('/delete', (req, res, next) => {
    const { userId, friendId } = req.body;
    var query = "delete from friendusers where userId = ? and friendId = ?";
    try {
        const results = db.query(query, [userId, friendId]);
        if (results.affectedRows == 0) {
            return res.status(404).json({ success: false, message: "Friend not found." });
        }
        return res.status(200).json({ success: true, message: "Friend Removed Successfully" });
    } catch {
        return res.status(500).json({ success: false, message: 'Error occured deleting your friend. Please try again later.' });
    }
})

module.exports = router;