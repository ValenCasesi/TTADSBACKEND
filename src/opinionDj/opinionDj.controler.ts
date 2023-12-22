import { Request, Response } from 'express'
import { orm } from '../shared/db/orm.js'
import { OpinionDj } from './opinionDj.entity.js'
import { t } from '@mikro-orm/core'
import { Dj } from '../dj/dj.entity.js'

const em = orm.em

async function findAll(req: Request, res: Response) {
  try {
    const opinionDjs = await em.find(OpinionDj, {})
    res
      .status(200)
      .json({ message: 'found all opinionDjs', data: opinionDjs })
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
      .json({ message: 'found OpinionDj', data: opiniondj })
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

    const opiniondjs = await em.find(OpinionDj, { dj: djEncontrado });

    res.status(200).json({ message: 'OpinionDjs encontrada', data: opiniondjs });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const actualDj = await em.findOne(Dj, { actual: true });

    if (!actualDj) {
      return res.status(404).json({ message: 'No se encontro un DJ con actual=true' });
    }

    const opiniondj = em.create(OpinionDj, req.body);
    opiniondj.dj = actualDj;
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
    res.status(200).json({ message: 'OpinionDj updated' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id
    const opiniondj = em.getReference(OpinionDj, id)
    await em.removeAndFlush(opiniondj)
    res.status(200).send({ message: 'OpinionDj deleted' })
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