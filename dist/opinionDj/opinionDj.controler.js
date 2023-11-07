import { orm } from '../shared/db/orm.js';
import { OpinionDj } from './opinionDj.entity.js';
import { Dj } from '../dj/dj.entity.js';
const em = orm.em;
async function findAll(req, res) {
    try {
        const opinionDjs = await em.find(OpinionDj, {});
        res
            .status(200)
            .json({ message: 'found all opinionDjs', data: opinionDjs });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findOne(req, res) {
    try {
        const id = req.params.id;
        const opiniondj = await em.findOneOrFail(OpinionDj, { id });
        res
            .status(200)
            .json({ message: 'found OpinionDj', data: opiniondj });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findOpinionByDj(req, res) {
    try {
        const id = req.params.id;
        const dj = await em.findOne(Dj, { id });
        if (!dj) {
            return res.status(404).json({ message: 'Dj not found' });
        }
        const opiniondjs = await em.find(OpinionDj, { dj: dj });
        res.status(200).json({ message: 'found OpinionDjs', data: opiniondjs });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function add(req, res) {
    try {
        const actualDj = await em.findOne(Dj, { actual: true });
        if (!actualDj) {
            return res.status(404).json({ message: 'No DJ with actual=true found' });
        }
        const opiniondj = em.create(OpinionDj, req.body);
        opiniondj.dj = actualDj;
        await em.flush();
        res.status(201).json({ message: 'OpinionDj created', data: opiniondj });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function update(req, res) {
    try {
        const id = req.params.id;
        const opiniondj = em.getReference(OpinionDj, id);
        em.assign(opiniondj, req.body);
        await em.flush();
        res.status(200).json({ message: 'OpinionDj updated' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function remove(req, res) {
    try {
        const id = req.params.id;
        const opiniondj = em.getReference(OpinionDj, id);
        await em.removeAndFlush(opiniondj);
        res.status(200).send({ message: 'OpinionDj deleted' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//export { findAll, findOne, add, update, remove }
export const opinionMethods = {
    findAll,
    findOne,
    add,
    update,
    remove,
    findOpinionByDj
};
//# sourceMappingURL=opinionDj.controler.js.map