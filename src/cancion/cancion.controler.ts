import { Request, Response } from 'express'
import { orm } from '../shared/db/orm.js'
import { Cancion } from './cancion.entity.js'

const em = orm.em

async function findAll(req: Request, res: Response) {
  try {
    const canciones = await em.find(Cancion, {})
    res
      .status(200)
      .json({ message: 'found all Canciones', data: canciones })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id
    const cancion = await em.findOneOrFail(Cancion, { id })
    res
      .status(200)
      .json({ message: 'found Cancion', data: cancion })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const cancion = em.create(Cancion, req.body)
    await em.flush()
    res
      .status(201)
      .json({ message: 'Cancion created', data: cancion })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id
    const cancion = em.getReference(Cancion, id)
    em.assign(cancion, req.body)
    await em.flush()
    res.status(200).json({ message: 'Cancion updated' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id
    const cancion = em.getReference(Cancion, id)
    await em.removeAndFlush(cancion)
    res.status(200).send({ message: 'Cancion deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { findAll, findOne, add, update, remove }