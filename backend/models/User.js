const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    telegramId: {
      type: Number,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      default: "",
    },
    firstName: {
      type: String,
      default: "",
    },
    lastName: {
      type: String,
      default: "",
    },
    level: {
      type: Number,
      default: 1,
    },
    experience: {
      type: Number,
      default: 0,
    },
    wbuxDollars: {
      type: Number,
      default: 100,
    },
    wbuxBalance: {
      type: Number,
      default: 0,
    },
    loginStreak: {
      type: Number,
      default: 1,
    },
    referralCode: {
      type: String,
      required: true,
      unique: true,
    },
    referralCount: {
      type: Number,
      default: 0,
    },
    referredBy: {
      type: String,
      default: null,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    miningRateLevel: {
      type: Number,
      default: 1,
    },
    miningBoostLevel: {
      type: Number,
      default: 1,
    },
    miningTimeLevel: {
      type: Number,
      default: 1,
    },
    nftSlotLevel: {
      type: Number,
      default: 0,
    },
    completedTasks: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("User", userSchema)
