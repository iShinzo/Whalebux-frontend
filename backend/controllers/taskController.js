const Task = require("../models/Task")
const User = require("../models/User")
const { v4: uuidv4 } = require("uuid")

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
    res.status(200).json(tasks)
  } catch (error) {
    console.error("Error getting tasks:", error)
    res.status(500).json({ error: "Server error" })
  }
}

// Get tasks for user
exports.getTasksForUser = async (req, res) => {
  try {
    const telegramId = Number.parseInt(req.query.userId)

    if (isNaN(telegramId)) {
      return res.status(400).json({ error: "Invalid Telegram ID" })
    }

    // Get all global tasks
    const tasks = await Task.find({ global: true })

    // Get user's completed tasks
    const user = await User.findOne({ telegramId })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Mark tasks as completed if they're in the user's completedTasks array
    const tasksWithCompletionStatus = tasks.map((task) => ({
      ...task.toObject(),
      completed: user.completedTasks.includes(task.id),
    }))

    res.status(200).json(tasksWithCompletionStatus)
  } catch (error) {
    console.error("Error getting tasks for user:", error)
    res.status(500).json({ error: "Server error" })
  }
}

// Create new task
exports.createTask = async (req, res) => {
  try {
    const { type, title, description, reward, rewardType, global = true } = req.body

    // Validate admin key
    const adminKey = req.headers["x-admin-key"]
    if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    // Create new task
    const newTask = new Task({
      id: `task_${uuidv4()}`,
      type,
      title,
      description,
      reward,
      rewardType,
      global,
    })

    // Save task
    await newTask.save()

    res.status(201).json(newTask)
  } catch (error) {
    console.error("Error creating task:", error)
    res.status(500).json({ error: "Server error" })
  }
}

// Complete task
exports.completeTask = async (req, res) => {
  try {
    const taskId = req.params.taskId
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" })
    }

    // Find task
    const task = await Task.findOne({ id: taskId })

    if (!task) {
      return res.status(404).json({ error: "Task not found" })
    }

    // Find user
    const user = await User.findOne({ telegramId: Number.parseInt(userId) })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Check if task is already completed
    if (user.completedTasks.includes(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Task already completed",
        reward: 0,
        rewardType: task.rewardType,
      })
    }

    // Add task to completed tasks
    user.completedTasks.push(taskId)

    // Add reward
    if (task.rewardType === "DOLLARS") {
      user.wbuxDollars += task.reward
    } else {
      user.wbuxBalance += task.reward
    }

    // Save user
    await user.save()

    res.status(200).json({
      success: true,
      message: "Task completed successfully",
      reward: task.reward,
      rewardType: task.rewardType,
    })
  } catch (error) {
    console.error("Error completing task:", error)
    res.status(500).json({ error: "Server error" })
  }
}

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.taskId

    // Validate admin key
    const adminKey = req.headers["x-admin-key"]
    if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    // Find and delete task
    const task = await Task.findOneAndDelete({ id: taskId })

    if (!task) {
      return res.status(404).json({ error: "Task not found" })
    }

    res.status(200).json({ message: "Task deleted successfully" })
  } catch (error) {
    console.error("Error deleting task:", error)
    res.status(500).json({ error: "Server error" })
  }
}
