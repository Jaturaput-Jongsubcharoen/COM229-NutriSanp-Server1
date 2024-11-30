//mongodb+srv://JaturaputJongsubcharoen:mac0840747314@comp229.evxxr.mongodb.net/
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();
const PORT = 5000;

// MongoDB connection
const MONGO_URI = "mongodb+srv://JaturaputJongsubcharoen:mac0840747314@comp229.evxxr.mongodb.net";
mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Middleware to parse JSON requests
app.use(express.json());

//Middleware for JWT Verification**
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json("Access denied, no token provided");
  }

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json("Invalid token");
  }
}

// Serve static HTML files
app.use(express.static(path.join(__dirname, "public")));

// Mock user database (for demo purposes)
let users = [];

// Secret key for JWT signing
const SECRET_KEY = "comp229secretkey";


// Schema and Model
const nutrientSchema = new mongoose.Schema({
  food_name: String,
  nf_calories: Number,
  nf_protein: Number,
  nf_total_fat: Number,
  nf_total_carbohydrate: Number,
  category: String,
});

const Nutrient = mongoose.model("Nutrient", nutrientSchema);

// Routes

// Registration 
app.post("/register", async (req, res) => {
  const { username, password, email } = req.body;

  // Hash the password before storing
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword, email });

  res.status(201).json("User registered successfully");
});

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(400).json("Invalid credentials");
  }

  // Compare the provided password with the hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json("Invalid credentials");
  }





// Get all saved nutrients
app.get("/nutrients", async (req, res) => {
  try {
    const nutrients = await Nutrient.find();
    res.json(nutrients);
  } catch (err) {
    res.status(500).json({ message: "Error fetching data", error: err });
  }
});

// Save nutrient data
app.post("/nutrients", async (req, res) => {
  try {
    const nutrient = new Nutrient(req.body);
    await nutrient.save();
    res.status(201).json({ message: "Nutrient data saved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error saving data", error: err });
  }
});

// Protect Route
app.get("/api/dashboard", authenticateToken, (req, res) => {
  res.json({ username: req.user.username, email: req.user.email });
});

// Route to serve HTML page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

