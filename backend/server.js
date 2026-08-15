const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, ".env") });

const connectDB = require("./config/db");
const projectRoutes = require("./routes/projectRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Project API
app.use("/api/projects", projectRoutes);

// Contact API
app.use("/api/contact", contactRoutes);

// Test API
app.get("/api", (req, res) => {
    res.json({
        message: "Portfolio Backend is Running!"
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});