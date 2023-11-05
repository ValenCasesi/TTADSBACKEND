import { Request, Response } from 'express'
import { orm } from '../shared/db/orm.js'
import { opinionDj } from './opinionDj.entity.js'
import { t } from '@mikro-orm/core'
import { Dj } from '../dj/dj.entity.js'

const em = orm.em

async function findAll(req: Request, res: Response) {
  try {
    const opinionDjs = await em.find(opinionDj, {})
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
    const opiniondj = await em.findOneOrFail(opinionDj, { id })
    res
      .status(200)
      .json({ message: 'found OpinionDj', data: opiniondj })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOpinionByDj(req: Request, res: Response) {
  try {
    const { nombre, instagram } = req.params;
    const dj = await em.findOne(Dj, { nombre, instagram });

    if (!dj) {
      return res.status(404).json({ message: 'Dj not found' });
    }

    const opiniondjs = await em.find(opinionDj, { Dj: dj });

    res.status(200).json({ message: 'found OpinionDjs', data: opiniondjs });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const actualDj = await em.findOne(Dj, { actual: true });

    if (!actualDj) {
      return res.status(404).json({ message: 'No DJ with actual=true found' });
    }

    const opiniondj = em.create(opinionDj, req.body);
    opiniondj.Dj = actualDj;
    await em.flush();

    res.status(201).json({ message: 'OpinionDj created', data: opiniondj });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id
    const opiniondj = em.getReference(opinionDj, id)
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
    const opiniondj = em.getReference(opinionDj, id)
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