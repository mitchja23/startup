const express = require('express');
const { LocalStorage } = require('node-localstorage');
const app = express();
const path = require('path');
const multer = require('multer');

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

app.post('/data', (req, res) => {
  try {
      const { taskCount, coinCount, soldItems } = req.body;

      const user = users.find(user => user.id === req.query.userid);
      const username = user ? user.username : '';
      const userid = user ? user.id : '';

      localStorage.setItem('taskCount', taskCount);
      localStorage.setItem('coinCount', coinCount);
      localStorage.setItem('soldItems', JSON.stringify(soldItems));


      res.json({ taskCount, coinCount, soldItems, username, userid });
  } catch (error) {
      console.error("Error occurred while updating data:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
});

const upload = multer({
    storage: multer.diskStorage({
      destination: 'uploads/',
      filename: (req, file, cb) => {
        const filetype = file.originalname.split('.').pop();
        const id = Math.round(Math.random() * 1e9);
        const filename = `${id}.${filetype}`;
        cb(null, filename);
      },
    }),
    limits: { fileSize: 64000 },
  });
  
  app.post('/upload', upload.single('file'), (req, res) => {
    if (req.file) {
      res.send({
        message: 'Uploaded succeeded',
        file: req.file.filename,
      });
    } else {
      res.status(400).send({ message: 'Upload failed' });
    }
  });
  
  app.get('/file/:filename', (req, res) => {
    res.sendFile(__dirname + `/uploads/${req.params.filename}`);
  });
  
  app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      res.status(413).send({ message: err.message });
    } else {
      res.status(500).send({ message: err.message });
    }
  });



const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
