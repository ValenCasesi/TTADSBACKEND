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
                return res.status(201).json({ message: 'CancionDj agregadas exitosamente!', data: cancionDj });
            }
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findAll(req, res) {
    try {
        const cancionDjs = await em.find(CancionDj, {});
        res
            .status(200)
            .json({ message: 'todas las CancionDj', data: cancionDjs });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findAllFechas(req, res) {
    try {
        const cancionDjs = await em.find(CancionDj, {});
        // Obtener todas las fechas sin repeticiones
        const uniqueDates = new Set();
        cancionDjs.forEach((cancionDj) => {
            const fechaActual = cancionDj.fechaActual?.toLocaleDateString();
            if (fechaActual) {
                uniqueDates.add(fechaActual);
            }
        });
        // Convertir el conjunto a un array si es necesario
        const uniqueDatesArray = Array.from(uniqueDates);
        res.status(200).json({ message: 'found all unique dates', data: uniqueDatesArray });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findAllVotacion(req, res) {
    try {
        const cancionDjs = await em.find(CancionDj, { actual: true }, { populate: ['cancion'] });
        res.status(200).json({ message: 'Se encontraron todas las CancionDj actuales', data: cancionDjs });
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
            return res.status(404).json({ message: 'CancionDj no encontrada' });
        }
        cancionDj.puntaje += 1;
        await em.flush();
        res.status(200).json({ message: 'Se ha registrado la votacion exitosamente!' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findAllTopCanciones(req, res) {
    try {
        const fechaElegida = req.params.fechaElegida.split('/').reverse().join('-');
        const cancionDjs = await em.find(CancionDj, { actual: true, fechaActual: { $eq: new Date(fechaElegida) } }, { populate: ['cancion'] });
        res.status(200).json({ message: 'found all CancionDj actuales', data: cancionDjs });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function deleteAll(req, res) {
    try {
        const cancionDjs = await em.find(CancionDj, {});
        cancionDjs.forEach(async (cancionDj) => { await em.removeAndFlush(cancionDj); });
        res.status(200).send({ message: 'All matching entries deleted' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function updateAllActualFalse(req, res) {
    try {
        await setAllActualFalse();
        res.status(200).json({ message: 'Actualizado las CancionDj a estado actual Falso' });
    }
    catch (error) {
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
async function nuevaNoche(req, res) {
    try {
        await djMethods.updateDjFechaActual(req, res);
        await setAllActualFalse();
        res.status(200).json({ message: 'Nueva Noche creada exitosamente!' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const canciondjMethods = {
    add,
    findAll,
    findAllVotacion,
    update,
    findAllTopCanciones,
    deleteAll,
    updateAllActualFalse,
    nuevaNoche,
    findAllFechas
};
//# sourceMappingURL=cancionDj.controler.js.map