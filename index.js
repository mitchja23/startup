const express = require('express');
const { LocalStorage } = require('node-localstorage');
const app = express();
const path = require('path');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');

const cfg = require('./dbConfig.json');
const url = `mongodb+srv://${cfg.userName}:${cfg.password}@${cfg.hostname}`;

const client = new MongoClient(url);
const db = client.db('startup');

client
  .connect()
  .then(() => db.command({ ping: 1 }))
  .then(() => console.log(`Connected to MongoDB Atlas`))
  .catch((ex) => {
    console.log(`Error with ${url} because ${ex.message}`);
    process.exit(1);
  });

app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.post('/register', async (req, res) => {
  try {
    console.log("Request Body:", req.body); 

    const { username, email, password } = req.body;

    if (!username || !email) {
      return res.status(400).json({ message: "Username and email are required" });
    }

    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const userId = generateUserID();

    const newUser = {
      username,
      email,
      password: hashedPassword, 
      userId 
    };


    await db.collection('UserData').insertOne(newUser);

    res.redirect('/index.html');
  } catch (error) {
    console.error("Error occurred while registering user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});





app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db.collection('UserData').findOne({ email });
    if (!user) {
      return res.status(401).redirect('/index.html'); 
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).redirect('/index.html'); 
    }

    res.redirect('/home.html');
  } catch (error) {
    console.error("Error occurred while logging in:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get('/cookie', (req, res) => {
  const token = uuid.v4();
  res.cookie('token', token, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
 
  res.send({ token: token });
});

app.get('*', (req, res) => {
  const token = req?.cookies.token;
  res.send({ token: token });
});

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


app.post('/data', async (req, res) => {
  try {
    const { taskCount, coinCount, soldItems } = req.body;
    const userId = req.query.userid;

  
    const user = await db.collection('UserData').findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    await db.collection('UserData').updateOne(
      { _id: userId },
      { $set: { taskCount, coinCount, soldItems } }
    );


    res.json({ taskCount, coinCount, soldItems, username: user.username, userid: user._id });
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

const port = 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
