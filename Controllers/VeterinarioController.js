import veterinarioForgotPasswordEmail from "../Email/veterinarioForgotPasswordEmail.js";
import veterinarioRegisterEmail from "../Email/veterinarioRegisterEmail.js";
import AuthenticationError from "../Errors/AuthenticationError.js";
import VeterinarioError from "../Errors/VeterinarioError.js";
import { VeterinarioModel } from "../Models/VeterinarioModel.js";
import generarId from "../utilities/generateId.js";
import getJsonWebToken from "../utilities/getJsonWebToken.js";

export default class VeterinarioController {
    static async register(req, res) {
        try {
            const { email } = req.body;
        
            let veterinario = await VeterinarioModel.findOne({email});
            
            if(veterinario) {
                throw new VeterinarioError(400, 'Usuario registrado');
            }
            
            veterinario = new VeterinarioModel(req.body);
            const veterinarioSaved = await veterinario.save();
            await veterinarioRegisterEmail(veterinario);
            res.json(veterinarioSaved);
        } catch (err) {
            if( err instanceof VeterinarioError ) {
                res.status(err.status).json({error: err.message});
            } else {
                console.log(err.message);
                res.json({error: "Ha ocurrido un error"});
            }
        }
    }

    static async update(req,res) {
        try {
            const id = req.params.id;
            const veterinarioToUpdate = req.body;

            const veterinario = await VeterinarioModel.findById(id);

            if(!veterinario) {
                throw new VeterinarioError(400, 'El veterinario no existe');
            }

            console.log();

            if(veterinarioToUpdate.email && veterinarioToUpdate.email !== veterinario.email) {
                const existUserWithEmail = await VeterinarioModel.findOne({email: veterinarioToUpdate.email});
                if(existUserWithEmail) {
                    throw new VeterinarioError(400, 'Este correo ya está registrado');
                }
            }

            veterinario.name = veterinarioToUpdate.name;
            veterinario.email = veterinarioToUpdate.email;
            veterinario.phone = veterinarioToUpdate.phone;
            veterinario.web = veterinarioToUpdate.web;

            const veterinarioUpdated = await veterinario.save();

            res.json({veterinarioUpdated});
        } catch (err) {
            if( err instanceof VeterinarioError ) {
                res.status(err.status).json({error: err.message});
            } else {
                console.log(err.message);
                res.status(400).json({error: "Ha ocurrido un error"});
            }
        }


    }

    static profile(req, res) {
        const { veterinario } = req;
        res.json({veterinario});
    }

    static async confirm(req, res) {
        try {
            const { token } = req.params;
            const veterinario = await VeterinarioModel.findOne({token});
            
            if(!veterinario) {
                throw new AuthenticationError('Token no válido');
            }

            veterinario.token = null;
            veterinario.confirmed = true;
            
            await veterinario.save();

            res.json({message: "Confirmado correctamente"});
        } catch (err) {
            if( err instanceof AuthenticationError ) {
                res.status(400).json({error: err.message});
            } else {
                console.log(err.message);
                res.status(400).json({error: "Ha ocurrido un error"});
            }
        }
    }

    static async authenticate(req, res) {
        try {
            const {email, password} = req.body;
            const veterinario = await VeterinarioModel.findOne({email});

            if(!veterinario) {
                throw new AuthenticationError("El usuario no existe");
            }

            if(!veterinario.confirmed) {
                throw new AuthenticationError("Confirma tu cuenta para continuar");
            }
            
            if(!await veterinario.verifyPassword(password)) {
                throw new AuthenticationError("Contraseña incorrecta");
            }
            
            const json_web_token = getJsonWebToken(veterinario.id);

            res.json({
                _id: veterinario._id,
                name: veterinario.name,
                email: veterinario.email,
                json_web_token
            });
        } catch (err) {
            if( err instanceof AuthenticationError) {
                res.status(403).json({error: err.message});
            } else {
                console.log(err.message);
                res.status(400).json({error: "Ha ocurrido un error"});
            }
            
        }
    }

    static async forgotPassword(req, res) {
        try {
            const { email } = req.body;

            const veterinario = await VeterinarioModel.findOne({email});

            if(!veterinario) {
                throw new AuthenticationError('El usuario no existe');
            }

            veterinario.token = generarId();
            await veterinario.save();

            await veterinarioForgotPasswordEmail(veterinario);

            res.json({message: "Hemos enviado un email con las instrucciones"});

        } catch (err) {
            if(err instanceof AuthenticationError) {
                res.status(400).json({error: err.message});
            } else {
                console.log(err.message);
                res.status(400).json({error: "Ha ocurrido un error"});
            }
        }
    }
    
    static async verifyTokenPassword(req, res) {
        try {
            const { token } = req.params;
            const veterinario = await VeterinarioModel.findOne({token});

            if(!veterinario ) {
                throw new AuthenticationError('Token no válido');
            }

            res.json({token});
        } catch (error) {
            if(error instanceof AuthenticationError) {
                res.status(400).json({error:error.message});
            } else {
                console.log(err.message);
                res.status(400).json({error: "Ha ocurrido un error"});
            }
        }
    }
    
    static async resetPassword(req, res) {
        try {
            const { password } = req.body;
            const { token } = req.params;
            const veterinario = await VeterinarioModel.findOne({token});

            if(!veterinario ) {
                throw new AuthenticationError('Token no válido');
            }

            veterinario.token = null;
            veterinario.password = password;
            await veterinario.save();

            res.json({message: "Contraseña modificada correctamente"});
        } catch (error) {
            if(error instanceof AuthenticationError) {
                res.status(400).json({error:error.message});
            } else {
                console.log(error.message);
                res.status(400).json({error: "Ha ocurrido un error"});
            }
        }
    }

    static async updatePassword(req, res) {
        try {
            const {id} = req.veterinario;
            const {password, newPassword} = req.body;

            const veterinario = await VeterinarioModel.findById(id);

            if(!await veterinario.verifyPassword(password)) {
                throw new AuthenticationError('Contraseña incorrecta');
            }

            veterinario.password = newPassword;
            await veterinario.save();
            res.json({message: "Se ha cambiado tu contraseña correctamente"});
        } catch (error) {
            if(error instanceof AuthenticationError) {
                res.status(404).json({error:error.message});
            } else if(error instanceof VeterinarioError){
                res.status(400).json({error:error.message});
            } else {
                console.log(error.message);
                res.status(400).json({error: "Ha ocurrido un error"});
            }
        }

        

        

    }
}