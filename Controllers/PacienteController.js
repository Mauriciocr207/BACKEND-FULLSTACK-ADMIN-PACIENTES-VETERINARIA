import { PacienteModel } from "../Models/PacienteModel.js";


export default class PacienteController {
    static async addPaciente(req, res) {
        try {
            const {email} = req.body;
            let paciente = await PacienteModel.findOne({email});

            if(paciente) {
                throw new Error('Ya existe un paciente con este email');
            }

            paciente = new PacienteModel(req.body);
            paciente.veterinario = req.veterinario._id;

            const pacienteSaved = await paciente.save();

            res.json({
                name: pacienteSaved.name,
                email: pacienteSaved.email,
                registration: pacienteSaved.registration,
                owner: pacienteSaved.owner,
                symptoms: pacienteSaved.symptoms,
                veterinario: pacienteSaved.veterinario,
                _id: pacienteSaved._id,
            });
        } catch (error) {
            res.status(404).json({error:error.message});
        }
    }

    static async getAllPacientes(req, res) {
        const pacientes = await PacienteModel.find().where({veterinario: req.veterinario}).select('-createdAt -updatedAt -__v');
        res.json(pacientes);
    }

    static async getPaciente(req,res) {
        try {
            const { id } = req.params;
            const paciente = await PacienteModel.findById(id);

            if(!paciente) {
                throw new Error('Paciente no encontrado');
            }

            if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
                throw new Error('Acción no válida')
            }
            
            return res.json(paciente);
        } catch (error) {
            res.status(404).json({error: error.message});
        }
    }

    static async updatePaciente(req,res) {
        try {
            const { id } = req.params;
            let paciente = await PacienteModel.findById(id);

            if(!paciente) {
                throw new Error('Paciente no encontrado');
            }

            if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
                throw new Error('Acción no válida');
            }

            const { name, owner, email, registration, symptomps } = req.body;

            paciente.name = name || paciente.name;
            paciente.owner = owner || paciente.owner;
            paciente.email = email || paciente.email;
            paciente.registration = registration || paciente.registration;
            paciente.symptomps = symptomps || paciente.symptomps;

            await paciente.save();

            res.json({message: "Actualizado correctamente"});
        } catch (error) {
            res.status(400).json({error: error.message});
        }
    }

    static async deletePaciente(req,res) {
        try {
            const { id } = req.params;
            let paciente = await PacienteModel.findById(id);

            if(!paciente) {
                throw new Error('Paciente no encontrado');
            }

            if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
                throw new Error('Acción no válida');
            }

            await paciente.deleteOne();

            res.json({message: "Paciente eliminado"});
        } catch (error) {
            res.status(404).json({error: error.message});
        }
    }
}