import { Request, Response } from 'express'
import { orm } from '../shared/db/orm.js'
import { Dj } from './dj.entity.js'

const em = orm.em


async function findAll(req: Request, res: Response) {
  try {
    const djs = await em.find(Dj, {}, { orderBy: { actual: 'DESC' } });
    res.status(200).json({ message: 'found all djs', data: djs });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}


async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id
    const dj = await em.findOneOrFail(Dj, { id })
    res
      .status(200)
      .json({ message: 'found character class', data: dj })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const dj = em.create(Dj, req.body)
    await em.flush()
    res
      .status(201)
      .json({ message: 'character class created', data: dj })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id
    const dj = em.getReference(Dj, id)
    em.assign(dj, req.body)
    await em.flush()
    res.status(200).json({ message: 'character class updated' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function updateActual(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const dj = await em.findOne(Dj, id);
    if (!dj) {
      return res.status(404).json({ message: 'Dj not found' });
    }
    const allDjs = await em.find(Dj, {});
    allDjs.forEach(async (item) => {
      if (item.id === id) {
        item.actual = true;
      } else {
        item.actual = false;
      }
      await em.persistAndFlush(item);
    });
    res.status(200).json({ message: 'dj updated' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}


async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id
    const dj = em.getReference(Dj, id)
    await em.removeAndFlush(dj)
    res.status(200).send({ message: 'character class deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { findAll, findOne, add, update, updateActual, remove }