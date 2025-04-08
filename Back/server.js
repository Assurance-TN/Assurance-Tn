const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const path = require('path');

const database=require("./database/connection")

const cors=require("cors")
require('dotenv').config()
app.use(express.json());
app.use(cors())

const userRoutes = require("./routes/user");

app.use("/api/users", userRoutes);


// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


// Important: Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

module.exports=app