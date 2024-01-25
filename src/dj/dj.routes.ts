import { Router } from 'express'
import {
  djMethods
} from './dj.controler.js'
import {opinionMethods} from '../opinionDj/opinionDj.controler.js'
export const djRouter = Router()

djRouter.get("/", djMethods.findAll);
djRouter.get('/:id/opiniones',opinionMethods.findOpinionByDj)
djRouter.get('/opiniones',opinionMethods.findAll)
djRouter.get('/:id/opinion',opinionMethods.findOne)
djRouter.post('/opinion',opinionMethods.add)
djRouter.delete("/:id", djMethods.remove);
djRouter.delete('/opinion/:id',opinionMethods.remove)
djRouter.get("/fechanueva", djMethods.updateDjFechaActual);
djRouter.get("/:id", djMethods.findOne);
djRouter.post('/', djMethods.add)
djRouter.put("/:id", djMethods.update);
djRouter.put("/actual/:id", djMethods.updateActual);
djRouter.get("/actual", djMethods.findOneActual);