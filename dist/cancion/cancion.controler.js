import { orm } from '../shared/db/orm.js';
import { Cancion } from './cancion.entity.js';
const em = orm.em;
async function findAll(req, res) {
    try {
        const canciones = await em.find(Cancion, {});
        res
            .status(200)
            .json({ message: 'Se encontraron todas las Canciones', data: canciones });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findOne(req, res) {
    try {
        const id = req.params.id;
        const cancion = await em.findOneOrFail(Cancion, { id });
        res
            .status(200)
            .json({ message: 'Se encontro la Cancion', data: cancion });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// async function add(req: Request, res: Response) {
//   try {
//     const {nombre,autor} = req.body
//     const cancionExistente = await em.findOne(Cancion, { nombre,autor })
//     if (cancionExistente) {
//       return res.status(409).json({message:'Cancion existente', data: cancionExistente}) 
//     }
//     const cancionNueva = em.create(Cancion, req.body);
//     await em.flush();
//     return res.status(201).json({ message: 'Cancion creada', data: cancionNueva });
//   } catch (error: any) {
//     return res.status(500).json({ message: error.message })
//   }
// }
async function add(req, res) {
    try {
        const { nombre, autor } = req.body;
        const cancionExistente = await em.findOne(Cancion, { nombre, autor });
        if (cancionExistente) {
            res.status(409).json({ message: 'Cancion existente', data: cancionExistente });
            return cancionExistente;
        }
        else {
            const cancionNueva = em.create(Cancion, req.body);
            await em.flush();
            res.status(201).json({ message: 'Cancion creada exitosamente!', data: cancionNueva });
            return cancionNueva;
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function addSinRes(req, res) {
    try {
        const { nombre, autor } = req.body;
        const cancionExistente = await em.findOne(Cancion, { nombre, autor });
        if (cancionExistente) {
            return cancionExistente;
        }
        else {
            const cancionNueva = em.create(Cancion, req.body);
            await em.flush();
            return cancionNueva;
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function update(req, res) {
    try {
        const id = req.params.id;
        const cancion = em.getReference(Cancion, id);
        em.assign(cancion, req.body);
        await em.flush();
        res.status(200).json({ message: 'Cancion actualizada exitosamente!' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function remove(req, res) {
    try {
        const id = req.params.id;
        const cancion = em.findOneOrFail(Cancion, id);
        await em.removeAndFlush(cancion);
        res.status(200).send({ message: 'Cancion eliminada exitosamente!' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const cancionMethods = { findAll, findOne, add, addSinRes, update, remove };
//# sourceMappingURL=cancion.controler.js.map