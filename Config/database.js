import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const {
    MONGO_URI
} = process.env;

export const DB = async () => {
    try {
        const connection = await mongoose.connect(MONGO_URI);
        const {connection: {host, port}} = connection;
        const url = `${host}:${port}`;
        console.log(`Connected to MongoDB | ${url}`);
    } catch (error) {
        console.error("error on db: ", error);
        process.exit(1);
    }
}