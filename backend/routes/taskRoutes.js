const express = require("express")
const router = express.Router()
const taskController = require("../controllers/taskController")

// Get all tasks
router.get("/", taskController.getTasksForUser)

// Create new task
router.post("/", taskController.createTask)

// Complete task
router.post("/:taskId/complete", taskController.completeTask)

// Delete task
router.delete("/:taskId", taskController.deleteTask)

module.exports = router
