import mongoose, { Schema, model } from "mongoose";

const pacienteSchema = new Schema({
    name:{type: String, required:true, trim:true},
    owner:{type: String, required:true},
    email:{type: String, required:true, unique:true, trim:true},
    registration:{type: Date, default:Date.now, trim:true},
    symptoms:{type: String, default:true},
    veterinario:{type: mongoose.Schema.Types.ObjectId, ref: 'veterinario'},
}, {timestamps: true});



export const PacienteModel = model("paciente", pacienteSchema);

