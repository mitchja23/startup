const User = require("../models/User");
const Item = require("../models/Items");
const multer = require('multer');
const router = require("express").Router();
const bcrypt = require("bcrypt");
const path = require('path');



function authenticate(req, res, next) {
  if (!req.body.userId) {
    return res.status(401).json("You must be logged in to perform this action.");
  }
  next();
}

router.put("/:id", authenticate, async (req, res) => {
  try {
    const userId = req.params.id;
    const loggedInUserId = req.body.userId; 
    const updatedUserData = req.body; 
    
   
    if (loggedInUserId === userId) {
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        updatedUserData.password = await bcrypt.hash(req.body.password, salt);
      }

      const updatedUser = await User.findByIdAndUpdate(userId, {
        $set: updatedUserData,
      });

      res.status(200).json("Account has been updated");
    } else {
     
      res.status(403).json("You can update only your account!");
    }
  } catch (err) {
   
    console.error("Error updating user data:", err);
    res.status(500).json(err);
  }
});


router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account!");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you allready follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});

router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (user.followers.includes(req.body.userId)) {
          await user.updateOne({ $pull: { followers: req.body.userId } });
          await currentUser.updateOne({ $pull: { followings: req.params.id } });
          res.status(200).json("user has been unfollowed");
        } else {
          res.status(403).json("you dont follow this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you cant unfollow yourself");
    }
  });


  const mongoose = require("mongoose");


  router.get("/:id/data", async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
  
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
  
      const totalCoins = Array.isArray(user.Coins) ? user.Coins.reduce((acc, coin) => acc + coin, 0) : user.Coins;

  
      res.status(200).json({
        profilePicture: user.profilePicture,
        username: user.username,
        _id: user._id,
        TaskCount: user.TaskCount,
        Items: user.Items,
        followers: user.followers,
        Coins: totalCoins, 
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  
  
  router.post("/:id/submitTask", async (req, res) => {
    try {
      const userId = req.params.id; 
  
      const updatedUser = await User.findByIdAndUpdate(userId, { $push: { TaskCount: 1 } }, { new: true });
      
      const randomCoinCount = Math.floor(Math.random() * 10) + 1;
      updatedUser.Coins += randomCoinCount;
      await updatedUser.save();
  
      res.status(200).json({
        message: "Task submitted successfully",
        updatedUser: updatedUser
      });
    } catch (err) {
      console.error("Error submitting task:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.post("/:id/saveTask", async (req, res) => {
    try {
        const userId = req.params.id;
        const { content, difficulty } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

      
        user.Tasks.push({ content, difficulty });

    
        await user.save();

        res.status(200).json({
            message: "Task saved successfully",
            updatedUser: user
        });
    } catch (error) {
        console.error("Error saving task:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/:id/tasks", async (req, res) => {
  try {
      const userId = req.params.id;

      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      const tasks = user.Tasks;

      res.status(200).json(tasks);
  } catch (error) {
      console.error("Error fetching tasks data:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id/markAsSold", async (req, res) => {
  try {
    const itemId = req.params.id;

  
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

  
    item.count += 1;

   
    item.sold = true;


    await item.save();

  
    const userId = req.body.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

   
    user.Coins += item.price;


    await user.save();

    res.status(200).json({ message: "Item marked as sold successfully", updatedItem: item, updatedUser: user });
  } catch (error) {
    console.error("Error marking item as sold:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); 
  }
});
const upload = multer({ storage: storage });


router.post('/:id/uploadProfilePicture', upload.single('profilePicture'), async (req, res) => {
  try {
      if (req.file) {
       
          const profilePictureUrl = '/uploads/' + req.file.filename;

          const userId = req.headers['user-id']; 
          const user = await User.findByIdAndUpdate(userId, { profilePicture: profilePictureUrl });

        
          res.status(200).send(profilePictureUrl);
      } else {
          res.status(400).send('No file uploaded');
      }
  } catch (error) {
      console.error('Error uploading profile picture:', error);
      res.status(500).send('Internal Server Error');
  }
});











module.exports = router;
