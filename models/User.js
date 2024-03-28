const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 1,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    Coins: {
      type: Number,
      default: 0,
    },
    TaskCount: {
      type: Array,
      default: [],
    },
    Items: {
      type: Array,
      default: [],
    },
    Tasks: {
      type: Array,
      default: [],
    },
    FriendId: {
      type: String,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
