//mongodb+srv://JaturaputJongsubcharoen:mac0840747314@comp229.evxxr.mongodb.net/

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

