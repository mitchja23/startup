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
    console.log(`Error connecting to ${url} because ${ex.message}`);
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

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required" });
    }

    const existingUser = await db.collection('UserData').findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      username,
      email,
      password: hashedPassword, 
      taskCount: 0,
      coinCount: 0,
      soldItems: 0
      
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
    const passwordMatch = user ? await bcrypt.compare(password, user.password) : false;

    if (!user || !passwordMatch) {
      return res.status(401).redirect('/index.html'); 
    }

  
    const token = uuid.v4();
    res.cookie('token', token, {
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
    });

    res.redirect('/home.html');
  } catch (error) {
    console.error("Error occurred while logging in:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get('/cookie', (req, res) => {
  const token = req.cookies.token;
  res.send({ token: token });
});

app.get('*', (req, res) => {
  const token = req.cookies.token;
  res.send({ token: token });
});



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});


app.post('/data', validateToken, async (req, res) => {
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



function validateToken(req, res, next) {
  const token = req.cookies.token;
  const tokenUserId = req.cookies.tokenUserId;

  if (!token || !tokenUserId) {
    return res.status(401).redirect('/index.html');
  }



  next();
}

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
  if (!req.file) {
    return res.status(400).send({ message: 'Upload failed' });
  }

  const allowedFileTypes = ['image/jpeg', 'image/png'];
  if (!allowedFileTypes.includes(req.file.mimetype)) {
    return res.status(400).send({ message: 'Invalid file type' });
  }

  const maxFileSize = 1024 * 1024 * 2; 
  if (req.file.size > maxFileSize) {
    return res.status(400).send({ message: 'File size too large' });
  }

  res.send({
    message: 'Uploaded succeeded',
    file: req.file.filename,
  });
});

app.get('/file/:filename', (req, res) => {
  res.sendFile(__dirname + `/uploads/${req.params.filename}`);
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).send({ message: 'File upload error: ' + err.message });
  }
  console.error("Internal server error:", err);
  res.status(500).send({ message: "Internal Server Error" });
});

const port = 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
