import { Request, Response } from 'express'
import { orm } from '../shared/db/orm.js'
import { Dj } from './dj.entity.js'
import { DateTime } from "luxon";
import { Usuario } from '../usuario/usuario.entity.js';
import { usuarioMethods } from '../usuario/usuario.controler.js';

const em = orm.em

async function findAll(req: Request, res: Response) {
  try {
    const djs = await em.find(Dj, {}, { orderBy: { actual: 'DESC' } });
    res.status(200).json({ message: 'Todos los djs encontrados:', data: djs });
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

async function findOneActual(req: Request, res: Response) {
  try {
    const actualDj = await em.findOne(Dj, { actual: true });
    if (!actualDj) {
      return res.status(404).json({ message: 'No se encontro dj actual' });
    }
    res.status(200).json({ message: 'Dj actual encontrado', data: actualDj });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const newDj = em.create(Dj, req.body);
    await em.flush()
    res.status(201).json({ message: 'DJ creado exitosamente!', data: newDj });
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
    res.status(200).json({ message: 'Dj actualizado exitosamente!' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function updateActual(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const dj = await em.findOne(Dj, id);
    if (!dj) {
      return res.status(404).json({ message: 'Dj no encontrado' });
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
    res.status(200).json({ message: 'Dj actualizado exitosamente!' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id
    const dj = em.getReference(Dj, id)
    const eliminar = await usuarioMethods.eliminarDj(dj)
    if (!eliminar) {
      return res.status(404).json({ message: 'Error eliminando el usuario del dj.' });
    }
    await em.removeAndFlush(dj)
    res.status(200).send({ message: 'DJ eliminado correctamente' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function updateDjFechaActual(req: Request, res: Response) {
  try {
    const actualDj = await em.findOne(Dj, { actual: true });
    if (actualDj) {

      const fechaHoy = DateTime.now().setZone('UTC-3').toString().split('T')[0];
      // const fechaHoy =  new Date(
      //                             new Date().getFullYear(),
      //                             new Date().getMonth(),
      //                             new Date().getDate()).toISOString().split('T')[0];
      actualDj.fechaActual = fechaHoy;
      await em.flush();
      //res.status(200).json({ message: 'Fecha actualizada', data: actualDj });
    }
    else {
      res.status(404).json({ message: 'No se encontro dj actual' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function getFechaActualDj(req: Request, res: Response) {
  try {
    const usuario = await em.findOneOrFail(Usuario, { uid: req.params.uid });
    const dj = await em.findOne(Dj, { id: usuario.dj.id });
    if (dj) { res.status(200).json({ message: 'Fecha actual encontrada', fechaActual:dj.fechaActual }); }
    else { res.status(404).json({ message: 'No se encontro dj actual' }); }
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
  updateDjFechaActual,
  getFechaActualDj
};