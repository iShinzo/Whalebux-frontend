const express = require("express")
const router = express.Router()

// Simple test route for CORS
router.get("/test", (req, res) => {
  res.status(200).json({
    message: "CORS test successful",
    headers: {
      origin: req.headers.origin || "No origin header",
      referer: req.headers.referer || "No referer header"
    },
    timestamp: new Date().toISOString()
  })
})

module.exports = router
