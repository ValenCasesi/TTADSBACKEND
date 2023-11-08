import { Request, Response, response } from 'express'
import { orm } from '../shared/db/orm.js'
import { t } from '@mikro-orm/core'
import { Dj } from '../dj/dj.entity.js'
import { Cancion } from '../cancion/cancion.entity.js'
import { cancionMethods } from '../cancion/cancion.controler.js'
import { djMethods } from '../dj/dj.controler.js'
import { CancionDj } from './cancionDj.entity.js'

const em = orm.em

async function findOneByDjCancion(cancion:Cancion | undefined , dj:Dj , res: Response) {
    try {
      const cancionDj = await em.findOne(CancionDj, { cancion , dj , actual:true})
      if(cancionDj){
        return res.status(200).json({ message: 'cancionDj ya existente', data: cancionDj })
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
}

async function add(req: Request, res: Response) {
  try {
    const cancionExistente = await cancionMethods.addSinRes(req, res);
    if (res.statusCode !== 500) {
        const actualDj = await djMethods.findOneActual(res);
        if (!actualDj) {
            return res.status(404).json({ message: 'No hay un Dj Actual' });
        }
        const cancionDjExistente = await findOneByDjCancion(cancionExistente, actualDj, res );
        if (!cancionDjExistente) {
            const cancionDj = new CancionDj();
            cancionDj.dj= actualDj;
            cancionDj.cancion = cancionExistente;
            cancionDj.actual = true;
            cancionDj.fechaActual = actualDj.fechaActual;
            cancionDj.puntaje = 0;

            await em.persistAndFlush(cancionDj);
            return res.status(201).json({ message: 'CancionDj agregada a las que sonaran', data: cancionDj });
        } 
      }
  } catch (error: any) {
      res.status(500).json({ message: error.message });
  }
}

async function topCancionesFecha(fechaTop: Date) {
  const cancionesDj = await em.find(CancionDj, { fechaActual: fechaTop }, { orderBy: { puntaje: 'DESC' } });
  
  return cancionesDj;
}

async function findAll(req: Request, res: Response) {
  try {
    const cancionDjs = await em.find(CancionDj, {})
    res
      .status(200)
      .json({ message: 'found all CancionDj', data: cancionDjs })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findAllVotacion(req: Request, res: Response) {
  try {
    const cancionDjs = await em.find(CancionDj, { actual: true }, { populate: ['cancion'] });
    res.status(200).json({ message: 'found all CancionDj actuales', data: cancionDjs });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const cancionDj = await em.findOne(CancionDj, { id });
    
    if (!cancionDj) {
      return res.status(404).json({ message: 'CancionDj not found' });
    }

    cancionDj.puntaje += 1
    await em.flush();
    res.status(200).json({ message: 'CancionDj updated' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// async function findAllTopCanciones(req: Request, res: Response) {
//   try {
//     const fechaElegida = req.params
//     const cancionDjs = await em.find(CancionDj, { actual: true , fechaActual: fechaElegida}, { populate: ['cancion'] });
//     res.status(200).json({ message: 'found all CancionDj actuales', data: cancionDjs });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// }

// async function formatDate(req: Request, res: Response){
//   const fechaElegida = req.params.fechaElegida.split('/').reverse().join('-');
//   findAllTopCanciones(fechaElegida,x:response)
// }

async function findAllTopCanciones(req: Request,res:Response) {
  try {
    const fechaElegida = req.params.fechaElegida.split('/').reverse().join('-');
    const cancionDjs = await em.find(CancionDj, { actual: true, fechaActual: { $eq: new Date(fechaElegida) } }, { populate: ['cancion'] });
    res.status(200).json({ message: 'found all CancionDj actuales', data: cancionDjs });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}


export const canciondjMethods = {
  add,
  findAll,
  findAllVotacion,
  update,
  findAllTopCanciones
};