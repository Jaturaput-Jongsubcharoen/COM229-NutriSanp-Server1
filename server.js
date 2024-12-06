// Jaturaput
//----------------------------------------------------------------------------------------------
const express = require("express");
const app = express();
const cors = require("cors"); // Only declare cors once
const mongoose = require("mongoose"); // Import mongoose for MongoDB connection
const itemModel = require("./Item.js"); // Import Mongoose model
const axios = require("axios");

//----------------------------------------------------------------------------------------------
// Jaturaput
// Environment variables
require("dotenv").config(); // Load environment variables

const API_KEY = process.env.GENERATIVE_API_KEY; // Secure API key storage

// Connect to MongoDB without try-catch
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Global event listeners for connection success or error
mongoose.connection.on("connected", () => {
    console.log("MongoDB Connected!");
});
mongoose.connection.on("error", (err) => {
    console.error("MongoDB Connection Error:", err);
});

//----------------------------------------------------------------------------------------------
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
        const response = await itemModel.find();
        return res.json({ items: response });
    } catch (err) {
        console.error("Error fetching MongoDB data:", err);
        res.status(500).json({ error: "Failed to fetch data from MongoDB" });
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

//----------------------------------------------------------------------------------------------
// Start the server
const PORT = process.env.PORT || 8080; // Use environment variable or default port
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//----------------------------------------------------------------------------------------------