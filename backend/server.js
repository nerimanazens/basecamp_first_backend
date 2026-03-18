const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');

app.use(cors());
app.use(express.json());
app.use(session({
    secret: 'mybasecamp-secret',
    resave: false,  
    saveUninitialized: false
}));

const userRoutes = require('./routes/user.js');
const projectRoutes = require('./routes/project.js');

app.use(userRoutes);


app.listen(3000, () => {
    console.log('Server işləyir!');
});