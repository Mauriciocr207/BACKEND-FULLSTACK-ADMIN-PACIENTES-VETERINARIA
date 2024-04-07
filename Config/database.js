import mongoose from "mongoose";
import dotenv from "dotenv";

const result = dotenv.config();
console.log(result);
if(result.error) {
    console.log(result.error);
    throw new Error(result.error);
}

export const DB = async () => {
    try {
        console.log(process.env.MONGO_URI);
        const connection = await mongoose.connect(process.env.MONGO_URI);
        const {connection: {host, port}} = connection;
        const url = `${host}:${port}`;
        console.log(`Connected to MongoDB | ${url}`);
    } catch (error) {
        console.error("error on db: ", error);
        process.exit(1);
    }
}