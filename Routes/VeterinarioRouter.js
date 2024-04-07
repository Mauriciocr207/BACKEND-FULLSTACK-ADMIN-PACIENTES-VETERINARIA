import {Router} from "express";
import VeterinarioController from "../Controllers/VeterinarioController.js";
import authMiddleware from "../Middleware/authMiddleware.js";

const VeterinarioRouter = Router();

// public
VeterinarioRouter.post('/', VeterinarioController.register);
VeterinarioRouter.get('/confirmar/:token', VeterinarioController.confirm);
VeterinarioRouter.post('/login', VeterinarioController.authenticate);
VeterinarioRouter.post('/password_reset', VeterinarioController.forgotPassword);
VeterinarioRouter.route('/password_reset/:token')
                    .get(VeterinarioController.verifyTokenPassword)
                    .post(VeterinarioController.resetPassword);

// private
VeterinarioRouter.get('/perfil', authMiddleware, VeterinarioController.profile);
VeterinarioRouter.put('/perfil/:id', authMiddleware, VeterinarioController.update);
VeterinarioRouter.put('/update-password', authMiddleware, VeterinarioController.updatePassword);

export default VeterinarioRouter;