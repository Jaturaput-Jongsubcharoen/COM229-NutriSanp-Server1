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

const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(403).json({ error: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, secret_key);
        req.userID = decoded.userID; // Attach userID
        next();
    } catch (err) {
        res.status(401).json({ error: "Unauthorized" });
    }
};

app.get("/apiMongo", authenticateJWT, async (req, res) => {
    try {
        // Attached by the authenticateJWT middleware
        const userID = req.userID;

        if (!userID) {
            return res.status(400).json({ error: "userID is required" });
        }

        console.log("userID received from token:", userID); // Debugging

        const db = conn.connection.db;
        const itemsCollection = db.collection("items");

        // Query directly with userID as a string
        const response = await itemsCollection.find({ userID }).toArray();

        if (!response || response.length === 0) {
            return res.status(404).json({ error: "No items found for this userID" });
        }

        res.json({ items: response });
    } catch (err) {
        console.error("Error fetching MongoDB data:", err);
        res.status(500).json({ error: "Failed to fetch data from MongoDB" });
    }
});

// Add POST route to save product details to MongoDB
app.post("/nutrients", authenticateJWT, async (req, res) => {
    console.log("Received body:", req.body);
    try {
        const { name, calories, protein, carbohydrates, fat, mealType } = req.body;

        const userID = req.userID;

        // Please don't chacge this
        if (!name || !calories || !protein || !carbohydrates || !fat || !mealType) {
            return res.status(400).json({ error: "All fields are required" });
        }
        //------------------------------------------------------------------------
        // Save the data to MongoDB. Please don't chacge this
        const newItem = new Item({
            name,
            calories,
            protein,
            carbohydrates,
            fat,
            mealType,
            //------------------------------------------------------------------------
            userID,
            //------------------------------------------------------------------------
        });
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
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

    const token = jwt.sign(
        { userID: user._id, username: user.username, email: user.email },
        secret_key,
        { expiresIn: "1h" }
    );

    // Include the userID in the response
    res.json({ token, userID: user._id });
});

//----------------------------------------------------------------------------------------------

app.get("/getUser", authenticateJWT, async (req, res) => {
    try {
        const userID = req.userID; // Extract userID from token
        if (!userID) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // Use the User model to query the users collection
        const user = await User.findById(userID).select("username email"); // Select username and email
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Send the username to the client
        res.json({ username: user.username });
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ error: "Failed to fetch user details" });
    }
});

//----------------------------------------------------------------------------------------------
// Start the server
const PORT = process.env.PORT || 8080; // Use environment variable or default port
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//----------------------------------------------------------------------------------------------