const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static('public'));

let users = [];


function generateUserID() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let userID = '';
    for (let i = 0; i < 9; i++) {
        userID += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return userID;
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.redirect('/register.html');
    }
    res.redirect('/home.html');
});

app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    const existingUser = users.find(user => user.username === username || user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: "Username or email already exists" });
    }


    const userID = generateUserID();

    const newUser = {
        id: userID,
        username,
        email,
        password
    };

    users.push(newUser);
    res.redirect('/');
});

app.get('/data', (req, res) => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const soldItems = JSON.parse(localStorage.getItem('soldItems')) || [];
    const coinCount = parseInt(localStorage.getItem('coinCount')) || 0;

    const taskCount = tasks.length;
    const soldItemCount = soldItems.length;

    const data = {
        taskCount,
        soldItemCount,
        coinCount,
        username,
        userid
    };

    res.json(data);
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
