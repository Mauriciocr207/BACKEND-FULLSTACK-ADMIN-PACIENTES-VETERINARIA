import AuthenticationError from "../Errors/AuthenticationError.js";
import json_web_token, { decode } from "jsonwebtoken";
import { VeterinarioModel } from "../Models/VeterinarioModel.js";

export default async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if(!(authHeader && authHeader.startsWith('Bearer'))) {
            throw new AuthenticationError('Token no válido o inexistente');
        }

        const token = authHeader.split(" ")[1] ?? null;
        await json_web_token.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if(err) throw new AuthenticationError("Token no válido");
            const {id} = decoded;
            req.veterinario = await VeterinarioModel.findById(id).select('-password -token -confirmado');
        });

        next();
    } catch (error) {
        if(error instanceof AuthenticationError) {
            res.status(403).json({error: error.message});
        } else {
            res.status(400).json({error: error.message});
        }
    }
}