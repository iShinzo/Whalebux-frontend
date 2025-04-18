const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

// Enable CORS for specific origins
app.use(cors({
  origin: ['https://whalebux-frontend.onrender.com'], // Add other allowed origins if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Set Content Security Policy (CSP) headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'sha256-tedRox3su+GHX4mnJtzGrc5R6ADKfDKV8uYjLDmMupE='"], // Add other hashes or nonces as needed
      styleSrc: ["'self'", "'unsafe-inline'"], // Adjust as per your requirements
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'", "https://api.example.com"], // Add your API endpoints
      fontSrc: ["'self'", "https://fonts.googleapis.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  }
}));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});