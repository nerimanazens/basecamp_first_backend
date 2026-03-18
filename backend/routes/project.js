const db = require('../database/init.js');
const express = require('express');
const router = express.Router();

const {isAdmin, isLoggedIn} = require('../middleware/auth.js');

router.post('/create',isLoggedIn, (req, res) => {
    const data_from_user = req.body;
    const data_to_base = db.prepare('INSERT INTO projects (name, description, user_id) VALUES (?, ?, ?)');
    try {
        data_to_base.run(data_from_user.name, data_from_user.description, req.session.user_id);
        res.json({ message: 'Project created successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating project!' });
    }
});

router.get('/show', isLoggedIn, (req, res) => {
    try {
        const projects = db.prepare('SELECT * FROM projects where user_id = ?').all(req.session.user_id);
        res.json({ projects });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching projects!' });
    }
});

router.put('/update', isLoggedIn, (req, res) => {
    const data_from_user = req.body;
    const data_to_base = db.prepare('UPDATE projects SET name = ?, description = ? WHERE user_id = ?');
    try {
        data_to_base.run(data_from_user.name, data_from_user.description, req.session.user_id);
        res.json({ message: 'Project updated successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating project!' });
    }
});

router.delete('/delete', isLoggedIn, (req, res) => {
    const data_from_user = req.body;
    const data_to_base = db.prepare('DELETE FROM projects WHERE user_id = ?');
    try {
        data_to_base.run(req.session.user_id);
        res.json({ message: 'Project deleted successfully!' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting project!' });
    }
});


module.exports = router;