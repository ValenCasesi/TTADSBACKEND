import { Router } from 'express';
import { findAll, findOne, add, update, remove, updateActual, } from './dj.controler.js';
export const djRouter = Router();
djRouter.get('/', findAll);
djRouter.get('/:id', findOne);
djRouter.post('/', add);
djRouter.put('/:id', update);
djRouter.put('/actual/:id', updateActual);
djRouter.delete('/:id', remove);
//# sourceMappingURL=dj.routes.js.map