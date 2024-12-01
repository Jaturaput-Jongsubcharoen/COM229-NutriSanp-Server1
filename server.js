//Jaturaput
//-----------------------------------------------
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require('./db.js')
const itemModel = require('./Item.js');

connectDB();

const corsOptions = {
    origin: ["http://localhost:5173"],
};

app.use(express.json());
app.use(cors(corsOptions));


app.get("/api", async (req, res) => {
    res.json({ fruits: ["apple", "orange", "banana" ] });
});

app.get("/apiMongo", async (req, res) => {
    const response = await itemModel.find();
    return res.json({items : response});
});

app.listen(8080, () => {
    console.log("Server started on port 8080");
});
//-----------------------------------------------
// Gowsith
//
// server.js (Backend)
require('dotenv').config(); // Load environment variables

const express = require('express');
const axios = require('axios');
app.use(express.json());

// Use the API key securely from environment variables
const API_KEY = process.env.GENERATIVE_API_KEY; // Secure API key storage

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
        Authorization: `Bearer ${AIzaSyBjbMiCGWlR2MbgKOH14uGKpb6VHC8H13o}`, // Use the API key securely here
      },
    });

    // Return the API response to the frontend
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
