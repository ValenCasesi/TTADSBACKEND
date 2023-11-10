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
      .json({ message: 'DJ encontrado', data: dj })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOneActual(res: Response) {
  try {
    const actualDj = await em.findOneOrFail(Dj, { actual: true });
    if (!actualDj) {
      res.status(404).json({ message: 'No se econtro dj actual' });
    }
    return actualDj;
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const newDj = em.create(Dj, req.body);
    await em.flush()
    res.status(201).json({ message: 'DJ created', data: newDj });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id
    const dj = em.getReference(Dj, id)
    em.assign(dj, req.body)
    await em.flush()
    res.status(200).json({ message: 'Dj updated' })
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
    res.status(200).send({ message: 'DJ deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function updateDjFechaActual(req: Request, res: Response) {
  try {
    console.log("ENTREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")
    const actualDj = await findOneActual(res);
    if (actualDj) {
      const fechaHoy = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
      );
      actualDj.fechaActual = fechaHoy;
      await em.flush();
      res.status(200).json({ message: 'Fecha actualizada', data: actualDj });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export const djMethods = {
  findAll,
  findOne,
  findOneActual,
  add,
  update,
  updateActual,
  remove,
  updateDjFechaActual
};