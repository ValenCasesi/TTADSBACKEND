import { Request, Response, response } from 'express'
import { orm } from '../shared/db/orm.js'
import { t } from '@mikro-orm/core'
import { Dj } from '../dj/dj.entity.js'
import { Cancion } from '../cancion/cancion.entity.js'
import { cancionMethods } from '../cancion/cancion.controler.js'
import { djMethods } from '../dj/dj.controler.js'
import { CancionDj } from './cancionDj.entity.js'
import { usuarioMethods } from '../usuario/usuario.controler.js'
import { Usuario } from '../usuario/usuario.entity.js'
import { DateTime } from "luxon";

const em = orm.em

async function findOneByDjCancion(cancion:Cancion | undefined , dj:Dj , res: Response) {
    try {
      const cancionDj = await em.findOne(CancionDj, { cancion , dj , actual:true})
      if(cancionDj){
        return res.status(200).json({ message: 'La cancion ya existía', data: cancionDj })
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
}

async function add(req: Request, res: Response) {
  try {
    const cancionExistente = await cancionMethods.addSinRes(req, res);
    if (res.statusCode !== 500) {
        const actualDj = await em.findOne(Dj, { actual: true });
        if (!actualDj) {
            return res.status(404).json({ message: 'No hay un Dj Actual' });
        }
        const cancionDjExistente = await findOneByDjCancion(cancionExistente, actualDj, res );
        if (res.statusCode === 200) {
            return res;
        }
        if (!cancionDjExistente) {
            const cancionDj = new CancionDj();
            cancionDj.dj= actualDj;
            cancionDj.cancion = cancionExistente;
            cancionDj.actual = true;
            console.log(actualDj.fechaActual)
            cancionDj.fechaActual = actualDj.fechaActual;
            cancionDj.puntaje = 0;
            await em.persistAndFlush(cancionDj);
            return res.status(201).json({ message: 'Cancion agregada exitosamente', data: cancionDj });
        }
      }
  } catch (error: any) {
      res.status(500).json({ message: error.message });
  }
}

async function findAll(req: Request, res: Response) {
  try {
    const cancionDjs = await em.find(CancionDj, {})
    res
      .status(200)
      .json({ message: 'Todas las CancionDj', data: cancionDjs })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findAllFechas(req: Request, res: Response) {
  try {
    const cancionDjs = await em.find(CancionDj, {});
    
    // Obtener todas las fechas sin repeticiones
    const uniqueDates = new Set<String>();
    cancionDjs.forEach((cancionDj) => {
      const fechaActual = cancionDj.fechaActual;
      if (fechaActual) {
        uniqueDates.add(fechaActual);
      }
    });
    const uniqueDatesArray = Array.from(uniqueDates);
    res.status(200).json({ message: 'Todas las fechas', data: uniqueDatesArray });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}


async function findAllActuales(req: Request, res: Response) {
  try {
    const cancionDjs = await em.find(CancionDj, { actual: true }, { populate: ['cancion'] });
    res.status(200).json({ message: 'Se encontraron todas las CancionDj actuales', data: cancionDjs });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function sumarVoto(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const cancionDj = await em.findOne(CancionDj, { id });
    if (!cancionDj) {
      return res.status(404).json({ message: 'CancionDj no encontrada' });
    }
    cancionDj.puntaje += 1
    await em.flush();
    res.status(200).json({ message: 'Se ha registrado la votacion exitosamente!' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findAllTopCanciones(req: Request,res:Response) {
  try {
    const fechaElegida = req.params.fechaElegida.split('.').join('-');  
    const cancionDjs = await em.find(CancionDj, { fechaActual: { $eq: fechaElegida } }, { populate: ['cancion'] });
    res.status(200).json({ message: 'Se encontro el top canciones', data: cancionDjs });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteAll(req: Request, res: Response) {
  try {
    const cancionDjs = await em.find(CancionDj, {})
    cancionDjs.forEach(async (cancionDj) => {await em.removeAndFlush(cancionDj)})
    res.status(200).send({ message: 'All matching entries deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function updateAllActualFalse(req:Request,res: Response){
  try {
      await setAllActualFalse()

    res.status(200).json({ message: 'Actualizado las CancionDj a estado actual Falso' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function setAllActualFalse() {
  const cancionDjs = await em.find(CancionDj, { actual: true });
  for (const cancionDj of cancionDjs) {
    cancionDj.actual = false;
  }
  await em.flush();
}

async function nuevaNoche(req:Request,res: Response){
  try{
    await djMethods.updateDjFechaActual(req,res);
    await usuarioMethods.resetVotacion(req);
    await setAllActualFalse();
    res.status(200).json({ message: 'Nueva Noche creada exitosamente!' });
  }catch(error:any){
    res.status(500).json({ message: error.message });
  }
}

async function findDjPuntual(req:Request,res: Response){
  try{
    const uidDj = req.params.uidDj;
    const usuarioDj = await em.findOne(Usuario, { uid: uidDj });
    if (!usuarioDj) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    const dj = usuarioDj.dj
    if (!dj) {
      return res.status(404).json({ message: 'Dj no encontrado' });
    }
    const fechaHoy = DateTime.now().setZone('UTC-3').toString().split('T')[0];
    const cancionDjs = await em.find(CancionDj, { dj, fechaActual: fechaHoy }, {populate: ['cancion'],});
    res.status(200).json({ message: 'Se encontraron todas las CancionDj de hoy del Dj', data: cancionDjs });
  }catch(error:any){
    res.status(500).json({ message: error.message });
  }
}

async function update(req:Request,res: Response){
  try{
    const id = req.params.id;
    const cancionDj = await em.findOne(CancionDj, { id });
    if (!cancionDj) { return res.status(404).json({ message: 'CancionDj no encontrada' }); }
    const cancion = cancionDj.cancion;
    if (cancion) {
      const igualCancionModificada = await em.findOne(Cancion, { nombre: req.body.nombre, autor: req.body.autor, id: { $ne: cancion.id }}); // Busco si hay una cancion con el mismo nombre y autor que como quedaria modificada
      if( igualCancionModificada!=null){ // Aca si hay una cancion asi
        const igualCancionDJModificada = await em.findOne(CancionDj, { cancion: igualCancionModificada}); // Busco si hay una canciondj con el mismo nombre y autor que como quedaria modificada
        console.log(igualCancionDJModificada)
        if (igualCancionDJModificada != null) { // Aca si hay una canciondj asi
          igualCancionDJModificada.puntaje = igualCancionDJModificada.puntaje + cancionDj.puntaje; // Sumo los puntajes
          await em.flush();
          await em.removeAndFlush(cancionDj); // Elimino la canciondj que se modifico
          await em.removeAndFlush(cancion); // Elimino la cancion que se modifico
          res.status(200).json({ message: 'Se ha actualizado la Cancion exitosamente!' });
        }else{ // Aca si no hay una canciondj asi
          const actualDj = await em.findOne(Dj, { actual: true });
          if (!actualDj) { return res.status(404).json({ message: 'No hay un Dj Actual' }); }
          const nuevaCancionDj = new CancionDj();
          nuevaCancionDj.dj = actualDj;
          nuevaCancionDj.cancion = igualCancionModificada;
          nuevaCancionDj.actual = true;
          nuevaCancionDj.fechaActual = actualDj.fechaActual;
          nuevaCancionDj.puntaje = cancionDj.puntaje;
          await em.persistAndFlush(nuevaCancionDj);
          await em.removeAndFlush(cancionDj); // Elimino la canciondj que se modifico
          res.status(200).json({ message: 'Se ha actualizado la Cancion exitosamente!' });
        }
      }else{ // Aca si no hay una cancion asi
        cancion.autor = req.body.autor;
        cancion.nombre = req.body.nombre;
        cancionDj.puntaje = req.body.puntaje;
        await em.flush();
        res.status(200).json({ message: 'Se ha actualizado la Cancion exitosamente!' });
      }
    }else{ res.status(404).json({ message: 'Cancion no encontrada' }); }
  }catch(error:any){ res.status(500).json({ message: error.message }); }
}

async function deleteOne(req:Request,res: Response){
  try{
    const id = req.params.id;
    const cancionDj = await em.findOne(CancionDj, { id });
    if (!cancionDj) { return res.status(404).json({ message: 'CancionDj no encontrada' }); }
    await em.removeAndFlush(cancionDj);
    res.status(200).json({ message: 'Se ha eliminado la Cancion exitosamente!' });
  }
  catch(error:any){ res.status(500).json({ message: error.message }); }
}

async function findAllActualesIfDj(req:Request,res: Response){
  try{
    const uid = req.params.uid;
    const usuario = await em.findOne(Usuario, { uid });
    if (!usuario) { return res.status(404).json({ message: 'Usuario no encontrado' }); }
    const dj = usuario.dj;
    if (!dj) { return res.status(404).json({ message: 'Dj no encontrado' }); }
    if (!dj.actual) { return res.status(404).json({ message: 'No es el actual DJ' }); }
    const cancionDjs = await em.find(CancionDj, { actual:true }, {populate: ['cancion'],});
    res.status(200).json({ message: 'Se encontraron todas las CancionDj actuales del Dj', data: cancionDjs });
  }
  catch(error:any){ res.status(500).json({ message: error.message }); }
}

export const canciondjMethods = {
  add,
  findAll,
  findAllActuales,
  sumarVoto,
  findAllTopCanciones,
  deleteAll,
  updateAllActualFalse,
  nuevaNoche,
  findAllFechas,
  findDjPuntual,
  findAllActualesIfDj,
  update,
  deleteOne
};