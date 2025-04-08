require("dotenv").config()
const mongoose = require("mongoose")

console.log("Testing MongoDB connection...")
console.log("MongoDB URI:", process.env.MONGODB_URI ? "URI exists" : "URI missing")

// Log a sanitized version of the connection string (hiding password)
const sanitizedUri = process.env.MONGODB_URI?.replace(/mongodb\+srv:\/\/([^:]+):[^@]+@/, "mongodb+srv://$1:****@")
console.log(`Connecting with: ${sanitizedUri}`)

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully!")
    console.log(`Database name: ${mongoose.connection.db.databaseName}`)
    console.log(`Connection state: ${mongoose.connection.readyState}`)
    console.log("Host:", mongoose.connection.host)
    console.log("Port:", mongoose.connection.port)

    // List collections
    return mongoose.connection.db.listCollections().toArray()
  })
  .then((collections) => {
    console.log("Collections in database:")
    collections.forEach((collection) => {
      console.log(`- ${collection.name}`)
    })
    process.exit(0)
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err)

    if (err.name === "MongoServerError" && err.code === 18) {
      console.error("Authentication failed. Username or password is incorrect.")
    } else if (err.name === "MongoServerSelectionError") {
      console.error("Could not connect to any servers in your MongoDB Atlas cluster.")
      console.error("This might be due to network issues or incorrect hostname.")
    }

    process.exit(1)
  })
