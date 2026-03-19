
const bcrypt = require('bcryptjs');
const db = require('../database/init.js');
const express = require('express');
const router = express.Router();

const { isLoggedIn } = require('../middleware/auth.js');

router.post('/register', async (req, res) => {
    const data_from_user = req.body;
    const hashedPassword = await bcrypt.hash(data_from_user.password, 10);
    const data_to_base = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
    data_to_base.run(data_from_user.username, data_from_user.email, hashedPassword);
    res.json({ message: 'Registration successful!' });
});

router.post('/login', async (req, res) => {
    const data_from_user = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(data_from_user.email);
    if (!user) {
        return res.status(400).json({ message: 'No user found with this email!' });
    }
    const isPasswordValid = await bcrypt.compare(data_from_user.password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid password!' });
    }
    req.session.user_id = user.id;
    res.json({ message: 'Login successful!' });
});

router.delete('/delete-account', isLoggedIn, (req, res) => {
    db.prepare('DELETE FROM users WHERE id = ?').run(req.session.user_id);
    req.session.destroy();
    res.json({ message: 'Account deleted successfully!' });
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logout successful!' });
});

router.get('/all-users', (req, res) => {
    const users = db.prepare('SELECT id, username, email FROM users').all();
    res.json({ users });
});

router.get('/check-session', isLoggedIn, (req, res) => {
    res.json({ message: 'ok' });
});

module.exports = router;
