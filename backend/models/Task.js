const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ["AIRDROP", "CHANNEL_JOIN", "REFERRAL", "DAILY"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  reward: {
    type: Number,
    required: true,
  },
  rewardType: {
    type: String,
    enum: ["DOLLARS", "TOKENS"],
    required: true,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
  global: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Task", taskSchema)

