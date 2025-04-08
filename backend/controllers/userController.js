const User = require("../models/User")

// Get user by Telegram ID
exports.getUserByTelegramId = async (req, res) => {
  try {
    const telegramId = Number.parseInt(req.params.telegramId)

    if (isNaN(telegramId)) {
      return res.status(400).json({ error: "Invalid Telegram ID" })
    }

    const user = await User.findOne({ telegramId })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Update last login time
    user.lastLogin = new Date()

    // Check if it's a new day since last login to update streak
    const lastLoginDate = new Date(user.lastLogin).setHours(0, 0, 0, 0)
    const currentDate = new Date().setHours(0, 0, 0, 0)

    if (currentDate > lastLoginDate) {
      // It's a new day, increment login streak
      user.loginStreak += 1
    }

    await user.save()

    res.status(200).json(user)
  } catch (error) {
    console.error("Error getting user:", error)
    res.status(500).json({ error: "Server error" })
  }
}

// Check if user exists
exports.checkUserExists = async (req, res) => {
  try {
    const telegramId = Number.parseInt(req.params.telegramId)

    if (isNaN(telegramId)) {
      return res.status(400).json({ error: "Invalid Telegram ID" })
    }

    const user = await User.findOne({ telegramId })

    res.status(200).json({ exists: !!user })
  } catch (error) {
    console.error("Error checking user:", error)
    res.status(500).json({ error: "Server error" })
  }
}

// Create new user
exports.createUser = async (req, res) => {
  try {
    const { telegramId, username, firstName, lastName, referredBy } = req.body

    if (!telegramId) {
      return res.status(400).json({ error: "Telegram ID is required" })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ telegramId })

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" })
    }

    // Generate referral code
    const referralCode = `WHALE${telegramId}`

    // Create new user
    const newUser = new User({
      userId: `user_${telegramId}`,
      telegramId,
      username,
      firstName,
      lastName,
      referralCode,
      referredBy,
      wbuxDollars: 100, // Starting amount
      lastLogin: new Date(),
    })

    // Save user
    await newUser.save()

    // If user was referred, update referrer's count
    if (referredBy) {
      const referrer = await User.findOne({ referralCode: referredBy })
      if (referrer) {
        referrer.referralCount += 1
        await referrer.save()
      }
    }

    res.status(201).json(newUser)
  } catch (error) {
    console.error("Error creating user:", error)
    res.status(500).json({ error: "Server error" })
  }
}

// Update user
exports.updateUser = async (req, res) => {
  try {
    const telegramId = Number.parseInt(req.params.telegramId)

    if (isNaN(telegramId)) {
      return res.status(400).json({ error: "Invalid Telegram ID" })
    }

    const updates = req.body

    // Find and update user
    const user = await User.findOneAndUpdate({ telegramId }, updates, { new: true, runValidators: true })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.status(200).json(user)
  } catch (error) {
    console.error("Error updating user:", error)
    res.status(500).json({ error: "Server error" })
  }
}
