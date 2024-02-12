import { Router } from 'express'
import {
  usuarioMethods
} from './tipoUsuario.controler.js'

export const tipoUsuarioRouter = Router()

tipoUsuarioRouter.post('/add',usuarioMethods.add)