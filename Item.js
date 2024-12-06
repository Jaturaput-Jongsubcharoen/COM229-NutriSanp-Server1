const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    Calories: { type: String, required: true },
    Protein: { type: String, required: true },
    Fat: { type: String, required: true },
    Carbohydrates: { type: String, required: true },
});


const itemModel = mongoose.model("Item", itemSchema);
module.exports = itemModel;