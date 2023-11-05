import { Router } from 'express'
import {
  findAll,
  findOne,
  add,
  update,
  remove,
  updateActual
} from './dj.controler.js'
import {opinionMethods} from '../opinionDj/opinionDj.controler.js'
export const djRouter = Router()

djRouter.get('/', findAll)
djRouter.get('/opiniones',opinionMethods.findAll)
djRouter.get('/:id/opinion',opinionMethods.findOne)
djRouter.post('/opinion',opinionMethods.add)
djRouter.get('/:nombre/:instagram/opiniones',opinionMethods.findOpinionByDj)
djRouter.get('/:id', findOne)
djRouter.post('/', add)
djRouter.put('/:id', update)
djRouter.put('/actual/:id', updateActual)
djRouter.delete('/:id', remove)