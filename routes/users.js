const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");


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

        // Calculate total coins
        const totalCoins = user.Coins.reduce((acc, coin) => acc + coin, 0);

        res.status(200).json({
            profilePicture: user.profilePicture,
            username: user.username,
            _id: user._id,
            TaskCount: user.TaskCount,
            Items: user.Items,
            followers: user.followers,
            Coins: user.Coins,
            totalCoins: totalCoins, // Add total coins to the response
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

        // Add the task to the user's Tasks array
        user.Tasks.push({ content, difficulty });

        // Save the updated user
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

    res.status(200).json({ message: "Item marked as sold successfully", updatedItem: item });
  } catch (error) {
    console.error("Error marking item as sold:", error);
    res.status(500).json({ error: "Internal server error" });
  }
  router.get("/:id/coins", async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Return the user's coin count
        res.status(200).json({ coinCount: user.Coins});
    } catch (error) {
        console.error("Error fetching user's coin count:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
});



module.exports = router;
