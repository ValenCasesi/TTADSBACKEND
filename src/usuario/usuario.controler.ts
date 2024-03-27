import { Request, Response } from 'express'
import { orm } from '../shared/db/orm.js'
import { Dj } from '../dj/dj.entity.js'
import { Usuario } from './usuario.entity.js'
import { tipoUsuario } from '../tipoUsuario/tipoUsuario.entity.js'
import * as dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { fail } from 'assert'

const em = orm.em
dotenv.config();

async function login(req: Request, res: Response) {
  try {
    const uid = req.body.uid;
    const usuario = await em.findOne(Usuario, {uid: uid})
    if (!usuario) {
        const mail = req.body.mail;
        const dj = await em.findOne(Usuario, {mail: mail})
        if (!dj){
          const newUsuario = em.create(Usuario, req.body)
          newUsuario.logueado = true;
          const tipoCliente = await em.findOneOrFail(tipoUsuario, { rol: "Cliente" });
          newUsuario.tipoUsuario = tipoCliente;
          await em.flush();
          const tokenPayload = {
            id: newUsuario._id,
            nombre: newUsuario.nombre,
            mail: newUsuario.mail,
            tipoU: newUsuario.tipoUsuario.rol
          }
          const token = jwt.sign(tokenPayload,'v4asd')
          //res.cookie("jwt",token)
          //En la data mandar el token y los datos del usuario
          const data = {
            token: token,
            uid: newUsuario.uid,
            nombre: newUsuario.nombre,
            mail: newUsuario.mail,
            tipo: newUsuario.tipoUsuario.rol
          }
          res.status(201).json({ message: "Usuario creado exitosamente!", data: data });
        }else{
          dj.uid = uid;
          dj.nombre = req.body.nombre;
          dj.logueado = true;  
          await em.persistAndFlush(dj);
          const tokenPayload = {
            id: dj._id,
            nombre: dj.nombre,
            mail: dj.mail
          }
          const token = jwt.sign(tokenPayload,'v4asd')
          //res.cookie("jwt",token)
          const data = {
            token: token,
            uid: dj.uid,
            nombre: dj.nombre,
            mail: dj.mail,
            tipo: getTipoUsuarioTexto(dj.tipoUsuario)
          }
          res.status(201).json({ message: 'Data del Dj actualizada', data: data });
        } 
    }else{
      usuario.logueado = true;
      const tokenPayload = {
        id: usuario._id,
        nombre: usuario.nombre,
        mail: usuario.mail,
        tipoU: getTipoUsuarioTexto(usuario.tipoUsuario)
      }
      await em.flush();
      const token = jwt.sign(tokenPayload,'v4asd')
      //res.cookie("jwt",token)
      const tipo = await getTipoUsuarioTexto(usuario.tipoUsuario)
      const data = {
        token: token,
        uid: usuario.uid,
        nombre: usuario.nombre,
        mail: usuario.mail,
        tipo: tipo
      }
      res.status(200).json({ message: 'Se ha realizado el login exitosamente!', data: data });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

const getTipoUsuarioTexto = async (tipo: tipoUsuario) => {
  const tipo_usuario = await em.findOneOrFail(tipoUsuario,{id: tipo.id})
  return tipo_usuario.rol
}

async function logout(req: Request, res: Response) {
  try {
    const uid = req.params.uid;
    const dj = await em.findOne(Usuario, {uid: uid})
    if (!dj) {
      return res.status(404).json({ message: 'No se ha encontrado el usuario.' });
    }
    dj.logueado = false;
    await em.flush();
    res.status(200).json({ message: 'Sesión cerrada correctamente' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function registerDj(req: Request, res: Response) {
  try {
    const mail = req.body.mail;
    const idDj = req.body.idDj;
    const djBBDD = await em.findOne(Dj, {id: idDj});
    if (!djBBDD) {
      return res.status(404).json({ message: 'No se ha encontrado el dj.' });
    }
    const dj = await em.findOne(Usuario, {dj: djBBDD})
    if (!dj){
      const dj = await em.findOne(Usuario, {mail: mail})
      if (dj){
        dj.logueado = true;
        const tipoDj = await em.findOneOrFail(tipoUsuario, { rol: "Dj" });
        dj.tipoUsuario = tipoDj;
        dj.dj = djBBDD;
        await em.flush();
        res
        .status(201)
        .json({ message: "Usuario cliente transformado a Dj y mail de acceso guardado correctamente.", data: dj });
      }else{
        const newUsuario = await em.create(Usuario, req.body)
        newUsuario.logueado = true;
        const tipoDj = await em.findOneOrFail(tipoUsuario, { rol: "Dj" });
        newUsuario.tipoUsuario = tipoDj;
        newUsuario.dj = djBBDD;
        await em.flush();
        res
        .status(201)
        .json({ message: "Gmail de acceso del dj guardado correctamente.", data: newUsuario });
      }
    }else{
      if (dj.mail != mail){
        dj.mail = mail;
        await em.persistAndFlush(dj);
        return res.status(201).json({ message: 'Gmail de acceso del dj actualizado', data: dj });
      }else{
        return res.status(201).json({ message: 'El Gmail es el mismo que ya estaba cargado.', data: dj });
      }
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function getGmailDj(req: Request, res: Response) {
  try {
    const idDj = req.params.idDj;
    const djBBDD = await em.findOne(Dj, {id: idDj});
    if (!djBBDD) {
      return res.status(404).json({ message: 'No se ha encontrado el dj.' });
    }
    const dj = await em.findOne(Usuario, {dj: djBBDD})
    if (!dj) {
      return res.status(200).json({ message: 'No se ha encontrado el usuario.' });
    }
    return res.status(200).json({ message: 'Gmail encontrado', data: dj });
  }
  catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function getAll(req: Request, res: Response) {
  try {
    const usuarios = await em.find(Usuario, {});
    res.status(200).json({ message: 'Usuarios encontrados', data: usuarios });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function verificarDjActual(req: Request, res: Response) {
  try {
    const uid = req.params.uid;
    const usuario = await em.findOne(Usuario, {uid: uid})
    if (!usuario) {
      return res.status(404).json({ message: 'No se ha encontrado el usuario.' });
    }
    if (usuario.dj == null){
      return res.status(200).json({ message: 'No es un dj', esActual: false });
    }
    const djActual = await em.findOne(Dj, {actual: true});
    if (djActual==usuario.dj){
      return res.status(200).json({ message: 'Es el dj actual', esActual: true });
    }else{
      return res.status(200).json({ message: 'No es el Dj actual', esActual: false });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function yaVoto(req: Request, res: Response) {
  try {
    const uid = req.params.uid;
    const usuario = await em.findOne(Usuario, {uid: uid})
    if (!usuario) {
      return res.status(404).json({ message: 'No se ha encontrado el usuario.' });
    }
    usuario.votoRealizado=true;
    em.flush();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function resetVotacion(req: Request) {
  try {
    const usuarios = await em.find(Usuario, {votoRealizado: true});
    usuarios.forEach((usuario) => {
      usuario.votoRealizado = false;
    });
    await em.flush();;
  }catch (error: any) {
    fail;
  }
}

export const usuarioMethods = {
  login,
  logout,
  registerDj,
  getGmailDj,
  getAll,
  verificarDjActual,
  yaVoto,
  resetVotacion,
};