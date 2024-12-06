const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: String,
    Calories: String,
    Protein: String,
    Fat: String,
    Carbohydrates: String,
});
const itemModel = mongoose.model("items", itemSchema); // Explicitly set collection name

module.exports = itemModel;