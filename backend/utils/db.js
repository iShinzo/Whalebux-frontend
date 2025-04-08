const mongoose = require("mongoose")

// MongoDB connection helper
const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...")
    console.log("MongoDB URI format check:", process.env.MONGODB_URI ? "URI exists" : "URI missing")

    // Log a sanitized version of the connection string (hiding password)
    const sanitizedUri = process.env.MONGODB_URI?.replace(/mongodb\+srv:\/\/([^:]+):[^@]+@/, "mongodb+srv://$1:****@")
    console.log(`Connecting with: ${sanitizedUri}`)

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Increased timeout
      socketTimeoutMS: 45000,
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`)
    console.log(`Database name: ${conn.connection.name}`)
    console.log(`Connection state: ${conn.connection.readyState}`)
    return true
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`)
    if (error.name === "MongoServerSelectionError") {
      console.error("Could not select MongoDB server. This might be due to network issues or incorrect credentials.")
    }
    // Log a sanitized version of the connection string (hiding password)
    const sanitizedUri = process.env.MONGODB_URI?.replace(/mongodb\+srv:\/\/([^:]+):[^@]+@/, "mongodb+srv://$1:****@")
    console.error(`Attempted to connect with: ${sanitizedUri}`)
    return false
  }
}

// Check MongoDB connection status
const checkConnection = () => {
  const state = mongoose.connection.readyState
  console.log(`MongoDB connection state: ${state}`)
  /*
    0 = disconnected
    1 = connected
    2 = connecting
    3 = disconnecting
  */
  return state === 1
}

module.exports = { connectDB, checkConnection }
