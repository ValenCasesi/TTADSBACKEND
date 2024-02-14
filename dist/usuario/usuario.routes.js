import { Router } from 'express';
import { usuarioMethods } from './usuario.controler.js';
export const usuarioRouter = Router();
usuarioRouter.get('/:idDj', usuarioMethods.getGmailDj);
usuarioRouter.post('/login', usuarioMethods.login);
usuarioRouter.post('/register', usuarioMethods.registerDj);
usuarioRouter.put('/logout/:uid', usuarioMethods.logout);
//# sourceMappingURL=usuario.routes.js.map