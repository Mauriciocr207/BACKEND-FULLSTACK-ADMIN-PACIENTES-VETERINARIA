import { Router } from "express";
import PacienteController from "../Controllers/PacienteController.js";
import authMiddleware from "../Middleware/authMiddleware.js";

const PacienteRouter = Router();

PacienteRouter.route('/')
    .post(authMiddleware, PacienteController.addPaciente)
    .get(authMiddleware, PacienteController.getAllPacientes);
PacienteRouter.route('/:id')
    .get(authMiddleware, PacienteController.getPaciente)
    .put(authMiddleware, PacienteController.updatePaciente)
    .delete(authMiddleware, PacienteController.deletePaciente);



export default PacienteRouter;