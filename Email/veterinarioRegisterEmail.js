import email from "./email.js";
import dotenv from "dotenv";
dotenv.config();

const veterinarioRegisterEmail = ({email:to, name, token}) => {
    return email.sendMail({
        from: "veterinaria@veterinaria.com",
        to,
        subject: "Termina el registro de tu cuenta",
        text: "Comprueba tu cuenta en APV",
        html: `
            <h1>Bienvenidx ${name}</h1>
            <p>Comprueba tu cuenta con el siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprueba tu cuenta con el siguiente enlace:</a>
            <p>Si tu no creaste esta cuenta, ignora el mensaje</p>
        `
    });
}

export default veterinarioRegisterEmail;