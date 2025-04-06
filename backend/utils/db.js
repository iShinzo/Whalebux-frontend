const mongoose = require("mongoose")

// MongoDB connection helper
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`)
    return true
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`)
    // Log a sanitized version of the connection string (hiding password)
    const sanitizedUri = process.env.MONGODB_URI?.replace(/mongodb\+srv:\/\/([^:]+):[^@]+@/, "mongodb+srv://$1:****@")
    console.error(`Attempted to connect with: ${sanitizedUri}`)
    return false
  }
}

// Check MongoDB connection status
const checkConnection = () => {
  return mongoose.connection.readyState === 1
}

module.exports = { connectDB, checkConnection }

