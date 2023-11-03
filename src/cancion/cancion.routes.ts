import { Router } from 'express'
import {
  findAll,
  findOne,
  add,
  update,
  remove,
} from './cancion.controler.js'

export const cancionRouter = Router()

cancionRouter.get('/', findAll)
cancionRouter.get('/:id', findOne)
cancionRouter.post('/', add)
cancionRouter.put('/:id', update)
cancionRouter.delete('/:id', remove)