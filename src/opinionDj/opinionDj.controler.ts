import { Request, Response } from 'express'
import { orm } from '../shared/db/orm.js'
import { opinionDj } from './opinionDj.entity.js'
import { t } from '@mikro-orm/core'

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
      .json({ message: 'found character class', data: opiniondj })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const opiniondj = em.create(opinionDj, req.body)
    await em.flush()
    res
      .status(201)
      .json({ message: 'OpinionDj created', data: opiniondj })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
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
    remove
}