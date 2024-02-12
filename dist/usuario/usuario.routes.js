import { Router } from 'express';
import { usuarioMethods } from './usuario.controler.js';
export const usuarioRouter = Router();
usuarioRouter.post('/login', usuarioMethods.login);
// usuarioRouter.post('/register',usuarioMethods.registerDj)
//cuando el adm agregue un dj, hacer add dj, add usuario con ese dj, ponerle tipoUsuario y los datos que tengamos con el alta 
// del dueño.
// Cuando se loguee el Dj terminar de poner los campos necesarios.
//# sourceMappingURL=usuario.routes.js.map