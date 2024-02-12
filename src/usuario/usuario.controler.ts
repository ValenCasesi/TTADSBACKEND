import { Request, Response } from 'express'
import { orm } from '../shared/db/orm.js'
import { Usuario} from './usuario.entity.js'

const em = orm.em

async function login(req: Request, res: Response) {
  try {
    // Buscar si existe el UID
    // Verificar si tiene almacenado un dj
    // UID,email,nombre
    const newUsuario = em.create(Usuario, req.body);
    await em.flush();
    res
      .status(201)
      .json({ message: "Usuario creado exitosamente!", data: newUsuario });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}


export const usuarioMethods = {
  login,
  //registerdj
};