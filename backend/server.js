const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const session = require('express-session');
app.use(session({
    secret: 'mybasecamp-secret',
    resave: false,
    saveUninitialized: false
}))

app.use(express.json());

const bcrypt = require('bcryptjs');
const db = require('./database/init.js');

const { isLoggedIn,isAdmin} = require('./middleware/auth.js')

app.post('/register', (req, res) => {
    const data_from_client = req.body;
    if(!data_from_client){
        return res.status(400).json({message: 'Məlumat göndərilməyib!'})
    }
    const hashed_password = bcrypt.hashSync(data_from_client.password, 10);
    const data_to_sql = db.prepare('INSERT INTO users (username,email,password) VALUES (?, ?, ?)');
    try{
        data_to_sql.run(data_from_client.username, data_from_client.email, hashed_password);
    } catch(error){
        return res.status(500).json({message: 'Qeydiyyat zamanı xəta baş verdi!'})
    }
    res.json({message: 'Qeydiyyat uğurlu oldu!'});
})

app.post('/login', (req, res) => {
    const data_from_client = req.body;
    if(!data_from_client){
        return res.status(400).json({message: 'Məlumat göndərilməyib!'})
    }
    
    const data_from_sql = db.prepare('SELECT * FROM users WHERE email = ?').get(data_from_client.email);
    if(!data_from_sql){
        return res.status(400).json({message: 'Belə bir istifadəçi tapılmadı!'})
    }
    else{
        const is_password_correct = bcrypt.compareSync(data_from_client.password, data_from_sql.password);
        if(is_password_correct){
            req.session.user_id = data_from_sql.id;
            res.json({message: 'Giriş uğurlu oldu!'})
        }
        else{
            res.status(400).json({message: 'Parol yanlışdır!'})
        }
        
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            return res.status(500).json({message: 'Çıxış zamanı xəta baş verdi!'})
        }
        res.json({message: 'Çıxış uğurlu oldu!'})
    })
});

app.get('/all_users', (req, res) => {
    const all_users = db.prepare('SELECT * FROM users').all();
    res.json(all_users);
});


app.post("/create_project", isLoggedIn, (req, res) => {
    const data_from_client = req.body;
    const data_to_sql = db.prepare('INSERT INTO projects (name, description, user_id) VALUES (?, ?, ?)');
    try{
        data_to_sql.run(data_from_client.name, data_from_client.description, req.session.user_id);
    } catch(error){
        return res.status(500).json({message: 'Layihə yaradılarkən xəta baş verdi!'})
    }
    res.json({message: 'Layihə uğurlu oldu!'});
});

app.get('/my_projects', isLoggedIn, (req, res) => {
    const my_projects = db.prepare('SELECT * FROM projects WHERE user_id = ?').all(req.session.user_id);
    res.json(my_projects);
});



app.put('/update_project', isLoggedIn, (req, res) => {
    const data_from_client = req.body;
    const data_to_sql = db.prepare('UPDATE projects SET name = ?, description = ? WHERE id = ? AND user_id = ?');
    try{
        const result = data_to_sql.run(data_from_client.name, data_from_client.description, data_from_client.id, req.session.user_id);
        if(result.changes === 0){
            return res.status(400).json({message: 'Layihə tapılmadı!'})
        }
        res.json(result);
    } catch(error){
        return res.status(500).json({message: 'Layihə yenilənərkən xəta baş verdi!'})
    }

});

app.delete('/delete_project', isLoggedIn, (req, res) => {
    const data_to_sql = db.prepare('DELETE FROM projects WHERE id = ? AND user_id = ?');
    try{
        const result = data_to_sql.run(req.body.id, req.session.user_id);
        if(result.changes === 0){
            return res.status(400).json({message: 'Layihə tapılmadı!'})
        }
        res.json({message: 'Layihə silindi!'});
    } catch(error){
        return res.status(500).json({message: 'Layihə silinirken xəta baş verdi!'})
    }
});


app.delete('/admin_delete_user/:id', isAdmin, (req, res) => {
    const data_to_sql = db.prepare('DELETE FROM users WHERE id = ?');
    try{
        const result = data_to_sql.run(req.params.id);
        if(result.changes === 0){
            return res.status(400).json({message: 'İstifadəçi tapılmadı!'})
        }
        res.json({message: 'İstifadəçi silindi!'});
    } catch(error){
        return res.status(500).json({message: 'İstifadəçi silinirken xəta baş verdi!'})
    }
});




app.listen(3000, () => {
    console.log('Server işləyir!')
});