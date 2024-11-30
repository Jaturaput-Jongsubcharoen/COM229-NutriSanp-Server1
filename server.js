const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// MongoDB connection
const MONGO_URI = "mongodb+srv://josephabing:8VuDzRCHdCVyo0rD@comp229.po3sq.mongodb.net/";
mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Middleware
app.use(cors());
app.use(bodyParser.json());

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

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

