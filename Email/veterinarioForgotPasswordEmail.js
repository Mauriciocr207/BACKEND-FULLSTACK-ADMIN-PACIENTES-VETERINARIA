import email from "./email.js";
import dotenv from "dotenv";
dotenv.config();

const veterinarioForgotPasswordEmail = ({email:to, name, token}) => {
    return email.sendMail({
        from: "veterinaria@veterinaria.com",
        to,
        subject: "Solicitud de cambio de contraseña",
        text: "Reestablece tu contraseña",
        html: `
            <h1>Hola ${name}, has solicitado el reestablecimiento de tu contraseña</h1>
            <p>Da click en el siguiente enlace para cambiar tu contraseña</p>
            <a href="${process.env.FRONTEND_URL}/password_reset/${token}">Reestablecer contraseña</a>
            <p>Si tu no solicitaste el restablecimiento de tu contraseñ, ignora el mensaje</p>
        `
    });
}

export default veterinarioForgotPasswordEmail;