// Jaturaput
//----------------------------------------------------------------------------------------------
const express = require("express");
const mongoose = require("mongoose"); // Import mongoose for MongoDB connection
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const cors = require("cors"); // Only declare cors once
const axios = require("axios"); 
require("dotenv").config(); //  *Impotant line* -----------------------------------------------This loads the .env file
const secret_key = process.env.SECRET_KEY
const Item = require("./models/Item");

//----------------------------------------------------------------------------------------------
// Jaturaput
const API_KEY = process.env.GENERATIVE_API_KEY; // Secure API key storage

// Connect to MongoDB
let conn;

// IIFE for connecting to MongoDB without try-catch
(async () => {
    conn = await mongoose.connect(
        process.env.MONGO_URI
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
})();

// CORS configuration
const corsOptions = {
    origin: ["http://localhost:5173", "https://comp229-nutrisnap-client1.onrender.com"], // Allowed origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
    credentials: true, // Enable credentials if required
};

app.use(express.json());
app.use(cors(corsOptions));

//----------------------------------------------------------------------------------------------
// Jaturaput's routes
app.get("/api", async (req, res) => {
    res.json({ fruits: ["apple", "orange", "banana"] });
});

app.get("/apiMongo", async (req, res) => {
    try {
        const db = conn.connection.db;
        const itemsCollection = db.collection("items"); 
        const response = await itemsCollection.find({}).toArray(); 
        res.json({ items: response });
    } catch (err) {
        console.error("Error fetching MongoDB data:", err); 
        res.status(500).json({ error: "Failed to fetch data from MongoDB" });
    }
});

// Add POST route to save product details to MongoDB
app.post("/nutrients", async (req, res) => {
    try {
        const { name, calories, protein, carbohydrates, fat, mealType } = req.body;

        // Ensure all required fields are present
        if (!name || !calories || !protein || !carbohydrates || !fat || !mealType) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Save the data to MongoDB
        const newItem = new Item({
            name,
            calories,
            protein,
            carbohydrates,
            fat,
            mealType,
        });
        const savedItem = await newItem.save();
        res.status(201).json(savedItem); // Respond with the saved item
    } catch (error) {
        console.error("Error in /nutrients endpoint:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//----------------------------------------------------------------------------------------------
// Gowsith
app.post("/api/generate", async (req, res) => {
    const { input } = req.body;
    const prompt = `Get Estimate of caloric, carbohydrate, fat, and protein content for the food item, end with thank you "${input}".`;

    try {
        // Call the Gemini API securely
        const response = await axios.post(
            "https://api.google.com/generative-ai-endpoint",
            {
                model: "gemini-1.5-flash",
                prompt: prompt,
            },
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`, // Use the API key securely here
                },
            }
        );

        // Return the API response to the frontend
        res.json(response.data);
    } catch (err) {
        console.error("Error calling external API:", err);
        res.status(500).json({ error: "Something went wrong. Please try again." });
    }
});

//---------------------------------------------------------------------
//Sukhmanpreet register route
const User = mongoose.model("User", new mongoose.Schema({
    username: String,
    password: String,
    email: String
}));

app.post("/register", async (req, res) => {
    const { username, password, email } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Insert the user into the MongoDB using Mongoose model
        const newUser = new User({ username, password: hashedPassword, email });
        await newUser.save(); // Use save method to insert data
        res.status(201).json("User registered successfully");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to register user" });
    }
});


//Sukhmanpreet Login Route
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
  
    if (!user) {
      return res.status(400).json("Invalid credentials");
    }
  
    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json("Invalid credentials");
    }
    else{
        // res.status(201).json("ok")
    }
  
    const token = jwt.sign(
        { username: user.username, email: user.email },
        secret_key,
        { expiresIn: "1h" }
    );

    // Send the token in the response
    res.json({ token });
});

//----------------------------------------------------------------------------------------------
// Start the server
const PORT = process.env.PORT || 8080; // Use environment variable or default port
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//----------------------------------------------------------------------------------------------