import { Schema, model } from "mongoose"
import generarId from "../utilities/generateId.js";
import bcrypt from "bcrypt";

const veterinarioSchema = new Schema({
    name:{type: String, required:true, trim:true},
    password:{type: String, required:true},
    email:{type: String, required:true, unique:true, trim:true},
    phone:{type: String, default:true, trim:true},
    web:{type: String, default:null},
    token:{type: String, default: generarId},
    confirmed:{type: Boolean, default:false} 
});

veterinarioSchema.pre('save', async function(next) {
    if(this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

veterinarioSchema.methods = {
    async verifyPassword(password)  {
        return await bcrypt.compare(password, this.password);
    }
}

export const VeterinarioModel = model("veterinario", veterinarioSchema);

