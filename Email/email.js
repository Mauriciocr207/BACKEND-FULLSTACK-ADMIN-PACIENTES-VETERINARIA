import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const {
    EMAIL_USER,
    EMAIL_PASS,
    EMAIL_HOST,
    EMAIL_PORT,
} = process.env;

const email = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

export default email;