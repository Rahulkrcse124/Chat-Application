import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL;

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URL);
    console.log(` Connected to MongoDB: ${conn.connection.host}`);
  } catch (error) {
    console.error(` MongoDB connection error: ${error.message}`);
    process.exit(1); // Exit on failure
  }
};

export default connectDb;
