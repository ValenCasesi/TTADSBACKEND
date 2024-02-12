import { orm } from '../shared/db/orm.js';
import { Usuario } from './usuario.entity.js';
const em = orm.em;
async function login(req, res) {
    try {
        // Buscar si existe el UID
        // Verificar si tiene almacenado un dj
        // UID,email,nombre
        const newUsuario = em.create(Usuario, req.body);
        await em.flush();
        res
            .status(201)
            .json({ message: "Usuario creado exitosamente!", data: newUsuario });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const usuarioMethods = {
    login,
    //registerdj
};
//# sourceMappingURL=usuario.controler.js.map