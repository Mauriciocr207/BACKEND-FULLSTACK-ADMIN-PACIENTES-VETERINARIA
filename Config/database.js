import mongoose from "mongoose";
import dotenv from "dotenv";

const result = dotenv.config({silent: true});
console.log(result);
if(result.error) {
    console.log('error en dotenv');
    console.log(result.error);
    console.log(process.env.MONGO_URI);
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