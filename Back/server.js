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

// Serve static files from uploads directory with proper content types
app.use('/uploads', (req, res) => {
  try {
    // Clean the URL path
    const cleanPath = req.path.split(':')[0]; // Remove any ":1" suffix
    const filePath = path.join(__dirname, 'uploads', cleanPath.replace(/^\//, ''));
    
    console.log('Attempting to serve file:', {
      originalUrl: req.url,
      cleanPath: cleanPath,
      fullPath: filePath
    });

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log('File not found:', filePath);
      return res.status(404).send('File not found');
    }

    // Get file stats
    const stats = fs.statSync(filePath);
    if (!stats.isFile()) {
      console.log('Not a file:', filePath);
      return res.status(404).send('Not a file');
    }

    const ext = path.extname(filePath).toLowerCase();
    
    // Set appropriate headers for PDFs
    if (ext === '.pdf') {
      console.log('Setting PDF headers for:', filePath);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': stats.size,
        'Content-Disposition': 'inline; filename=' + path.basename(filePath),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
      });
    }

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    
    fileStream.on('error', (error) => {
      console.error('Error streaming file:', error);
      if (!res.headersSent) {
        res.status(500).send('Error reading file');
      }
    });

    fileStream.on('open', () => {
      console.log('Starting file stream for:', filePath);
    });

    fileStream.on('end', () => {
      console.log('Completed streaming file:', filePath);
    });

    fileStream.pipe(res);
  } catch (error) {
    console.error('Error handling file request:', error);
    if (!res.headersSent) {
      res.status(500).send('Internal server error');
    }
  }
});

// Register API routes
app.use("/api/users", userRoutes);
app.use("/api/contracts", contractRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log('Uploads directory:', uploadDir);
});

module.exports = app;