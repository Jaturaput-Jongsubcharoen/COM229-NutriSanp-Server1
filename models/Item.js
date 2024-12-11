const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  calories: { type: String, required: true },
  protein: { type: String, required: true },
  carbohydrates: { type: String, required: true },
  fat: { type: String, required: true },
  mealType: { type: String, required: true },
  //----------------------------------------------------------------------------
  userID: { type: String, required: true },
  //----------------------------------------------------------------------------
});

const Item = mongoose.model("Item", itemSchema, "items"); // Explicitly set collection name

module.exports = Item;