const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    name: String,
    Calories: String,
    Protein: String,
    Fat: String,
    Carbohydrates: String,
});

module.exports = mongoose.model("Item", itemSchema);