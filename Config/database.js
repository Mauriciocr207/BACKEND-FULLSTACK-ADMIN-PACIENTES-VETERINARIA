import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({silent: true});
console.log(process.env.PORT);
export const DB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        const {connection: {host, port}} = connection;
        const url = `${host}:${port}`;
        console.log(`Connected to MongoDB | ${url}`);
    } catch (error) {
        console.error("error on db: ", error);
        process.exit(1);
    }
}