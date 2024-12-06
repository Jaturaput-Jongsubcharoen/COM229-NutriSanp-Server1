// Jaturaput
//----------------------------------------------------------------------------------------------
const express = require("express");
const app = express();
const cors = require("cors"); // Only declare cors once
const connectDB = require('./db.js');
const itemModel = require('./Item.js');
const axios = require('axios');


// Connect to db.js //
connectDB();

app.use(cors({
    origin: ['http://localhost:5173', 'https://comp229-nutrisnap-client1.onrender.com'], // Allow both frontend and localhost for development
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow specific HTTP methods
    credentials: true, // Enable credentials if required
}));

// Add JSON parser middleware after CORS
app.use(express.json());

//----------------------------------------------------------------------------------------------
// Jaturaput //
// Environment variables
require('dotenv').config(); // Load environment variables
console.log('MONGO_URI:', process.env.MONGO_URI); // debugging

const API_KEY = process.env.GENERATIVE_API_KEY; // Secure API key storage

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

// Add
app.post("/apiMongo", async (req, res) => {
    try {
        const { Name, Calories, Protein, Fat, Carbohydrates } = req.body; // Extract fields

        if (!Name || !Calories || !Protein || !Fat || !Carbohydrates) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newItem = new itemModel({
            Name,
            Calories,
            Protein,
            Fat,
            Carbohydrates,
        });

        await newItem.save();
        res.status(201).json({ message: "Nutrient data saved successfully", item: newItem });
    } catch (err) {
        console.error("Error saving data to MongoDB:", err);
        res.status(500).json({ error: "Failed to save data to MongoDB" });
    }
});

//----------------------------------------------------------------------------------------------
// Gowsith
app.post('/api/generate', async (req, res) => {
    const { input } = req.body;
    const prompt = `Get Estimate of caloric, carbohydrate, fat, and protein content for the food item, end with thank you "${input}".`;

    try {
        // Call the Gemini API securely
        const response = await axios.post('https://api.google.com/generative-ai-endpoint', {
            model: "gemini-1.5-flash",
            prompt: prompt,
        }, {
            headers: {
                Authorization: `Bearer ${API_KEY}`, // Use the API key securely here
            },
        });

        // Return the API response to the frontend
        res.json(response.data);
    } catch (err) {
        console.error("Error calling external API:", err);
        res.status(500).json({ error: "Something went wrong. Please try again." });
    }
});

//----------------------------------------------------------------------------------------------
// Start the server
const PORT = process.env.PORT || 3000; // Use environment variable or default port
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//----------------------------------------------------------------------------------------------
