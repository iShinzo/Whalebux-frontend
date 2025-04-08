require("dotenv").config()
const mongoose = require("mongoose")
const Task = require("../models/Task")

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err)
    process.exit(1)
  })

// Default tasks
const defaultTasks = [
  {
    id: "task_1",
    type: "DAILY",
    title: "Daily Login Bonus",
    description: "Claim your daily WhaleBux reward",
    reward: 10,
    rewardType: "DOLLARS",
    global: true,
    createdAt: new Date(),
  },
  {
    id: "task_2",
    type: "CHANNEL_JOIN",
    title: "Join WhaleBux Announcements",
    description: "Join our official Telegram channel for updates",
    reward: 25,
    rewardType: "DOLLARS",
    global: true,
    createdAt: new Date(),
  },
  {
    id: "task_3",
    type: "REFERRAL",
    title: "Invite Friends",
    description: "Invite 3 friends to earn WBUX tokens",
    reward: 5,
    rewardType: "TOKENS",
    global: true,
    createdAt: new Date(),
  },
]

// Insert default tasks
const initDb = async () => {
  try {
    // Clear existing tasks
    await Task.deleteMany({})
    console.log("Cleared existing tasks")

    // Insert default tasks
    await Task.insertMany(defaultTasks)
    console.log("Database initialized with default tasks")

    process.exit(0)
  } catch (error) {
    console.error("Error initializing database:", error)
    process.exit(1)
  }
}

initDb()
