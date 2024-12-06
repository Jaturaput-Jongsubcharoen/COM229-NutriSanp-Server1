const mongoose = require('mongoose')
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Test MongoDB connection
        const testItems = await mongoose.connection.db.collection("items").find({}).toArray();
        console.log("Test Items from MongoDB:", testItems);
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1);
    }
};