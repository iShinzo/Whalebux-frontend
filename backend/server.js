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

// Improved CORS configuration
app.use(
  cors({
    origin: [
      "https://whalebux-frontend.vercel.app",
      "https://telegram.org", 
      "https://t.me",
      "https://web.telegram.org",
      "http://localhost:3001"
    ],
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "x-admin-key"]
  }),
)

// Handle preflight requests
app.options('*', cors());

app.use(express.json())
app.use(morgan("dev"))

// Log environment variables (sanitized)
console.log("Environment variables check:")
console.log("PORT:", process.env.PORT || "Not set (using default 3001)")
console.log("ADMIN_KEY:", process.env.ADMIN_KEY ? "Set" : "Not set")
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "Set" : "Not set")
console.log("NODE_ENV:", process.env.NODE_ENV || "Not set")

// Connect to MongoDB with better error handling
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // Increased timeout
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log("MongoDB connected successfully")
    console.log(`Database name: ${mongoose.connection.name}`)
    console.log(`Connection state: ${mongoose.connection.readyState}`)
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err)
    // Log a sanitized version of the connection string (hiding password)
    const sanitizedUri = process.env.MONGODB_URI?.replace(/mongodb\+srv:\/\/([^:]+):[^@]+@/, "mongodb+srv://$1:****@")
    console.error(`Attempted to connect with: ${sanitizedUri}`)
  })

// Routes
app.use("/api/users", userRoutes)
app.use("/api/tasks", taskRoutes)

// Root route for health check
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "WhaleBux API is running",
    timestamp: new Date().toISOString(),
  })
})

// Health check route with more details
app.get("/health", (req, res) => {
  const mongoState = mongoose.connection.readyState
  const mongoStateText =
    {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    }[mongoState] || "unknown"

  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    mongodb: mongoStateText,
    mongodbState: mongoState,
    environment: process.env.NODE_ENV || "development",
    adminKeySet: !!process.env.ADMIN_KEY,
    version: "1.0.0",
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

