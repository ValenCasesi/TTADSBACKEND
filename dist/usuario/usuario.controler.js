import { orm } from '../shared/db/orm.js';
import { Dj } from '../dj/dj.entity.js';
import { Usuario } from './usuario.entity.js';
import { tipoUsuario } from '../tipoUsuario/tipoUsuario.entity.js';
const em = orm.em;
async function login(req, res) {
    try {
        const uid = req.body.uid;
        const usuario = await em.findOne(Usuario, { uid: uid });
        if (!usuario) {
            const mail = req.body.mail;
            const dj = await em.findOne(Usuario, { mail: mail });
            if (!dj) {
                const newUsuario = await em.create(Usuario, req.body);
                newUsuario.logueado = true;
                const tipoCliente = await em.findOneOrFail(tipoUsuario, { rol: "Cliente" });
                newUsuario.tipoUsuario = tipoCliente;
                await em.flush();
                res
                    .status(201)
                    .json({ message: "Usuario creado exitosamente!", data: newUsuario });
            }
            else {
                dj.uid = uid;
                dj.nombre = req.body.nombre;
                dj.logueado = true;
                await em.persistAndFlush(dj);
                return res.status(201).json({ message: 'Data del Dj actualizada', data: dj });
            }
        }
        else {
            usuario.logueado = true;
            await em.flush();
            res.status(200).json({ message: 'Se ha realizado el login exitosamente!' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function registerDj(req, res) {
    try {
        const mail = req.body.mail;
        const idDj = req.body.idDj;
        const djBBDD = await em.findOne(Dj, { id: idDj });
        if (!djBBDD) {
            return res.status(404).json({ message: 'No se ha encontrado el dj.' });
        }
        const dj = await em.findOne(Usuario, { dj: djBBDD });
        if (!dj) {
            const newUsuario = await em.create(Usuario, req.body);
            newUsuario.logueado = true;
            const tipoDj = await em.findOneOrFail(tipoUsuario, { rol: "Dj" });
            newUsuario.tipoUsuario = tipoDj;
            newUsuario.dj = djBBDD;
            await em.flush();
            res
                .status(201)
                .json({ message: "Gmail de acceso del dj guardado correctamente.", data: newUsuario });
        }
        else {
            if (dj.mail != mail) {
                dj.mail = mail;
                await em.persistAndFlush(dj);
                return res.status(201).json({ message: 'Gmail de acceso del dj actualizado', data: dj });
            }
            else {
                return res.status(201).json({ message: 'El Gmail es el mismo que ya estaba cargado.', data: dj });
            }
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function getGmailDj(req, res) {
    try {
        const idDj = req.params.idDj;
        const djBBDD = await em.findOne(Dj, { id: idDj });
        if (!djBBDD) {
            return res.status(404).json({ message: 'No se ha encontrado el dj.' });
        }
        const dj = await em.findOne(Usuario, { dj: djBBDD });
        if (!dj) {
            return res.status(404).json({ message: 'No se ha encontrado el usuario.' });
        }
        return res.status(200).json({ message: 'Gmail encontrado', data: dj });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const usuarioMethods = {
    login,
    registerDj,
    getGmailDj
};
//# sourceMappingURL=usuario.controler.js.map