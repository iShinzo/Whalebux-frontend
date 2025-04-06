require("dotenv").config()
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const mongoose = require("mongoose")

// Import routes
const userRoutes = require("./routes/userRoutes")
const taskRoutes = require("./routes/taskRoutes")

// Initialize express app
const app = express()
const PORT = process.env.PORT || 3001

// Connect to MongoDB with better error handling
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err)
    // Log a sanitized version of the connection string (hiding password)
    const sanitizedUri = process.env.MONGODB_URI?.replace(/mongodb\+srv:\/\/([^:]+):[^@]+@/, "mongodb+srv://$1:****@")
    console.error(`Attempted to connect with: ${sanitizedUri}`)
  })

// Middleware
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

// Routes
app.use("/api/users", userRoutes)
app.use("/api/tasks", taskRoutes)

// Root route for health check
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "WhaleBux API is running",
  })
})

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    environment: process.env.NODE_ENV || "development",
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

