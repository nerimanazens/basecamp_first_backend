
const bcrypt = require('bcryptjs');
const db= require('../database/init.js');
const express = require('express');
const router= express.Router(); 

const { isLoggedIn } = require('../middleware/auth.js');

router.post('/register', async (req, res) => {
    const data_from_user= req.body;
    const hashedPassword = await bcrypt.hash(data_from_user.password, 10);
    const data_to_base = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
    data_to_base.run(data_from_user.username, data_from_user.email, hashedPassword);
    res.json({ message: 'Qeydiyyat uğurla tamamlandı!' });
});

router.post('/login', async (req, res) => {
    const data_from_user= req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(data_from_user.email);
    if (!user) {
        return res.status(400).json({ message: 'Bu email ilə istifadəçi tapılmadı!' });
    }
    const isPasswordValid = await bcrypt.compare(data_from_user.password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Yanlis şifrə!' });
    }
    req.session.user_id = user.id;
    res.json({ message: 'Giriş uğurla tamamlandi!'});
});

router.delete('/delete-account', isLoggedIn, (req, res) => {
    const data_from_user= req.body;
    const delete_user = db.prepare('DELETE FROM users WHERE email = ?');
    delete_user.run(data_from_user.email);
    res.json({ message: 'Hesab uğurla silindi!' });
});

router.get('/all', isLoggedIn, (req, res) => {
    const user = db.prepare('SELECT username, email FROM users ').get(req.session.user.email);
    res.json({ user });
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Çıxış zamanı bir hata oluştu!' });
        }
        res.json({ message: 'Çıxış başarılı!' });
    });
});


module.exports = router;
