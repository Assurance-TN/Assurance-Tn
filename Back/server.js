const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const path = require('path');

const database = require("./database/connection");

const cors = require("cors");
require('dotenv').config();

// Configure middleware
app.use(cors());
app.use(express.json());

// Special handling for Stripe webhook route
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payments/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// Import routes
const userRoutes = require("./routes/user");
const contractRoutes = require("./routes/contract");

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline');
    }
  }
}));

// Debug middleware for file requests
app.use((req, res, next) => {
  if (req.url.startsWith('/uploads')) {
    console.log('File request:', {
      url: req.url,
      method: req.method,
      headers: req.headers
    });
  }
  next();
});

// Register API routes
app.use("/api/users", userRoutes);
app.use("/api/contracts", contractRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log('Uploads directory:', uploadDir);
});

module.exports = app;