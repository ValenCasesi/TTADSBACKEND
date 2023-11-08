import { orm } from '../shared/db/orm.js';
import { cancionMethods } from '../cancion/cancion.controler.js';
import { djMethods } from '../dj/dj.controler.js';
import { CancionDj } from './cancionDj.entity.js';
const em = orm.em;
async function findOneByDjCancion(cancion, dj, res) {
    try {
        const cancionDj = await em.findOne(CancionDj, { cancion, dj, actual: true });
        if (cancionDj) {
            return res.status(200).json({ message: 'cancionDj ya existente', data: cancionDj });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function add(req, res) {
    try {
        const cancionExistente = await cancionMethods.addSinRes(req, res);
        if (res.statusCode !== 500) {
            const actualDj = await djMethods.findOneActual(res);
            if (!actualDj) {
                return res.status(404).json({ message: 'No hay un Dj Actual' });
            }
            const cancionDjExistente = await findOneByDjCancion(cancionExistente, actualDj, res);
            if (!cancionDjExistente) {
                const cancionDj = new CancionDj();
                cancionDj.dj = actualDj;
                cancionDj.cancion = cancionExistente;
                cancionDj.actual = true;
                cancionDj.fechaActual = actualDj.fechaActual;
                cancionDj.puntaje = 0;
                await em.persistAndFlush(cancionDj);
                return res.status(201).json({ message: 'CancionDj agregada a las que sonaran', data: cancionDj });
            }
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function topCancionesFecha(fechaTop) {
    const cancionesDj = await em.find(CancionDj, { fechaActual: fechaTop }, { orderBy: { puntaje: 'DESC' } });
    return cancionesDj;
}
async function findAll(req, res) {
    try {
        const cancionDjs = await em.find(CancionDj, {});
        res
            .status(200)
            .json({ message: 'found all CancionDj', data: cancionDjs });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findAllVotacion(req, res) {
    try {
        const cancionDjs = await em.find(CancionDj, { actual: true }, { populate: ['cancion'] });
        res.status(200).json({ message: 'found all CancionDj actuales', data: cancionDjs });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function update(req, res) {
    try {
        const id = req.params.id;
        const cancionDj = await em.findOne(CancionDj, { id });
        if (!cancionDj) {
            return res.status(404).json({ message: 'CancionDj not found' });
        }
        cancionDj.puntaje += 1;
        await em.flush();
        res.status(200).json({ message: 'CancionDj updated' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const canciondjMethods = {
    add,
    findAll,
    findAllVotacion,
    update
};
//# sourceMappingURL=cancionDj.controler.js.map