const mongoose = require('mongoose')
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {

    try {
        //console.log('MONGO_URI:', process.env.MONGO_URI); // Debugging
        const conn = await mongoose.connect(
            process.env.MONGO_URI
        );
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }

};

module.exports = connectDB;