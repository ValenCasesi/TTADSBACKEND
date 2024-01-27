import { Request, Response } from 'express'
import { orm } from '../shared/db/orm.js'
import { Usuario} from './usuario.entity.js'

const em = orm.em


export const usuarioMethods = {
  };