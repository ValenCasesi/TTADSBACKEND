import { Request, Response } from 'express'
import { orm } from '../shared/db/orm.js'
import { OpinionDj } from './opinionDj.entity.js'
import { t } from '@mikro-orm/core'
import { Dj } from '../dj/dj.entity.js'
import { Usuario } from '../usuario/usuario.entity.js'

const em = orm.em

async function findAll(req: Request, res: Response) {
  try {
    const opinionDjs = await em.find(OpinionDj, {})
    res
      .status(200)
      .json({ message: 'Se encontraron todas las opiniones del dj:', data: opinionDjs })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id
    const opiniondj = await em.findOneOrFail(OpinionDj, { id })
    res
      .status(200)
      .json({ message: 'Se encontro una opinion del dj:', data: opiniondj })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOpinionByDj(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const djEncontrado = await em.findOne(Dj, { id});

    if (!djEncontrado) {
      return res.status(404).json({ message: "Dj no encontrado" });
    }

    const opiniondjs = await em.find(OpinionDj, { dj: djEncontrado }, { populate: ['usuario'] });

    res.status(200).json({ message: 'Opiniones del dj encontradas', data: opiniondjs });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const actualDj = await em.findOne(Dj, { actual: true });

    if (!actualDj) {
      return res.status(404).json({ message: 'No existe un DJ actual' });
    }
    const usuario = await em.findOne(Usuario, { uid: req.body.uid });
    if (!usuario) {
      return res.status(404).json({ message: 'No se ha encontrado el usuario.' });
    }

    const opiniondj = em.create(OpinionDj, req.body);
    opiniondj.dj = actualDj;
    opiniondj.usuario = usuario;
    await em.flush();

    res.status(201).json({ message: 'Se ha registrado la opinion del Dj exitosamente!', data: opiniondj });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id
    const opiniondj = em.getReference(OpinionDj, id)
    em.assign(opiniondj, req.body)
    await em.flush()
    res.status(200).json({ message: 'OpinionDj actualizada' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id
    const opiniondj = em.getReference(OpinionDj, id)
    await em.removeAndFlush(opiniondj)
    res.status(200).send({ message: 'OpinionDj eliminada' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

//export { findAll, findOne, add, update, remove }
export const opinionMethods = {
    findAll,
    findOne,
    add,
    update,
    remove,
    findOpinionByDj
}