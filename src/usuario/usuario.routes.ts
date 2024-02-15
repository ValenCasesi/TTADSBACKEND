import { Router } from 'express'
import {
  usuarioMethods
} from './usuario.controler.js'

export const usuarioRouter = Router()

usuarioRouter.get('/all',usuarioMethods.getAll)
usuarioRouter.get('/:idDj',usuarioMethods.getGmailDj)
usuarioRouter.post('/login/:uid/:nombre/:mail',usuarioMethods.login)
usuarioRouter.post('/register',usuarioMethods.registerDj)
usuarioRouter.put('/logout/:uid',usuarioMethods.logout)