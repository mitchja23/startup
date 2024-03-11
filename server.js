const express = require('express');
const { LocalStorage } = require('node-localstorage');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static('public'));


const localStorage = new LocalStorage('./localStorage');

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
    console.log(userID)
    console.log(username)
});


app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.redirect('/register.html');
    }
    res.redirect('/home.html');
});


app.get('/data', (req, res) => {
    try {
      
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const soldItems = JSON.parse(localStorage.getItem('soldItems')) || [];
        const coinCount = parseInt(localStorage.getItem('coinCount')) || 0;

     
        const { username, userid } = req.query;

        const data = {
            taskCount: tasks.length,
            soldItemCount: soldItems.length,
            coinCount,
            username,
            userid
        };


        res.json(data);
    } catch (error) {
   
        console.error("Error occurred while retrieving data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});




const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
