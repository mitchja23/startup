const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require('cookie-parser');
const path = require('path');
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/TaskShare");

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

  app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(morgan("common"));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

app.use(express.static('./'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/:userId/home.html', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/home.html'));
});

app.get('/:userId/prize.html', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/prize.html'));
});

app.get('/:userId/friend.html', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/friend.html'));
});

app.get('/:userId/tasks.html', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/tasks.html'));
});

app.get('/:userId/settings.html', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/settings.html'));
});


const port = 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
