<<<<<<< Updated upstream
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

=======
//Jaturaput
const express = require("express");
>>>>>>> Stashed changes
const app = express();
const cors = require("cors");
const connectDB = require('./db.js')
const itemModel = require('./Item.js');

<<<<<<< Updated upstream
// MongoDB connection
const MONGO_URI = "mongodb+srv://josephabing:8VuDzRCHdCVyo0rD@comp229.po3sq.mongodb.net/";
mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));
=======
>>>>>>> Stashed changes


<<<<<<< Updated upstream
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

=======
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

>>>>>>> Stashed changes
