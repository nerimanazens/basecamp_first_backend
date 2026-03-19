const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');

app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: 'mybasecamp-secret',
    resave: false,  
    saveUninitialized: false
}));

const userRoutes = require('./routes/user.js');
const projectRoutes = require('./routes/project.js');

app.use(userRoutes);
app.use(projectRoutes)

app.listen(3000, () => {
    console.log('Server işləyir!');
});