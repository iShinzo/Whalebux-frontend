const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")

// Get user by Telegram ID
router.get("/:telegramId", userController.getUserByTelegramId)

// Check if user exists
router.get("/:telegramId/exists", userController.checkUserExists)

// Create new user
router.post("/", userController.createUser)

// Update user
router.patch("/:telegramId", userController.updateUser)

module.exports = router
