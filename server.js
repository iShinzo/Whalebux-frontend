const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

// Enable CORS for specific origins
app.use(cors({
  origin: [
    'https://whalebux-frontend.vercel.app',
    'https://whalebux-vercel.onrender.com',
    'https://*.telegram.org',
    'https://t.me'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// Set Content Security Policy (CSP) headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://telegram.org", "https://*.telegram.org"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://*.telegram.org"],
      connectSrc: ["'self'", "https://whalebux-vercel.onrender.com", "https://*.telegram.org"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameSrc: ["'self'", "https://*.telegram.org"],
      frameAncestors: ["'self'", "https://*.telegram.org"]
    }
  }
}));

// Add OPTIONS handler for CORS preflight requests
app.options('*', cors());

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is running on port ${process.env.PORT || 8080}`);
});