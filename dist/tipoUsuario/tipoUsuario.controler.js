import { orm } from "../shared/db/orm.js";
import { tipoUsuario } from "./tipoUsuario.entity.js";
const em = orm.em;
async function add(req, res) {
    try {
        const tipo = em.create(tipoUsuario, req.body);
        await em.flush();
        res.status(201).json({ message: "Tipo Usuario creado exitosamente!", data: tipo });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const usuarioMethods = {
    add
};
//# sourceMappingURL=tipoUsuario.controler.js.map