const express = require('express');
const router = express.Router();
const db = require('../database/init.js');
const { isLoggedIn } = require('../middleware/auth.js');

router.post('/create-project', isLoggedIn, (req, res) => {
    const data_from_user = req.body;
    const create_project = db.prepare('INSERT INTO projects (name, description, user_id) VALUES (?, ?, ?)');

    try {
        create_project.run(data_from_user.name, data_from_user.description, req.session.user_id);
    }
    catch (error) {
        return res.status(500).json({ message: 'Something went wrong!' });
    }
    res.json({ message: 'Project created successfully!' });
});

router.get('/my-projects', isLoggedIn, (req, res) => {
    try {
        const projects = db.prepare('SELECT id, name, description FROM projects WHERE user_id = ?').all(req.session.user_id);
        res.json({ projects });
       
    }
    catch (error) {
        return res.status(500).json({ message: 'Something went wrong!' });
    }
    
});

router.put('/update-project', isLoggedIn, (req, res) => {
    const data_from_user = req.body;
    const update_project = db.prepare('UPDATE projects SET name = ?, description = ? WHERE user_id = ?');
    try {
        update_project.run(data_from_user.name, data_from_user.description, req.session.user_id);
    }
    catch (error) {
        return res.status(500).json({ message: 'Something went wrong!' });
    }
    res.json({ message: 'Project updated successfully!' });
});

router.delete('/delete-project', isLoggedIn, (req, res) => {
    const data_delete_db= db.prepare('DELETE FROM projects WHERE user_id = ?');
    try {
        data_delete_db.run(req.session.user_id);
    }
    catch (error) {
        return res.status(500).json({ message: 'Something went wrong!' });
    }
    res.json({ message: 'Project deleted successfully!' });
});

module.exports = router;