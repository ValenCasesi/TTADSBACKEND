import { orm } from '../shared/db/orm.js';
import { Usuario } from './usuario.entity.js';
import { tipoUsuario } from '../tipoUsuario/tipoUsuario.entity.js';
const em = orm.em;
async function login(req, res) {
    try {
        // Buscar si existe el UID
        const uid = req.params.uid;
        const usuario = await em.findOne(Usuario, { uid: uid });
        if (!usuario) {
            const mail = req.params.mail;
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
                dj.nombre = req.params.nombre;
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
// Recibir por API el mail y guardarlo en un usuario nuevo, con tipo usuario= 'Dj' y logueado en true
// ESTO LO GUARDAMOS PARA EL REGISTER
//const tipoDj = await em.findOne(tipoUsuario, { rol: "Dj" });
export const usuarioMethods = {
    login,
    //registerdj
};
//# sourceMappingURL=usuario.controler.js.map