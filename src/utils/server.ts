import { RequestContext } from "@mikro-orm/core"
import cors from "cors"
import express from "express"
import { orm } from "../shared/db/orm.js"
import { usuarioRouter } from "../usuario/usuario.routes.js"
import { tipoUsuarioRouter } from "../tipoUsuario/tipoUsuario.routes.js"
import { djRouter } from "../dj/dj.routes.js"
import { cancionRouter } from "../cancion/cancion.routes.js"
import { cancionDjRouter } from "../cancionDj/cancionDj.routes.js"

export function createServer(){
    const app = express()
    app.use(express.json())
    app.use(cors())
    //luego de los middlewares base
    app.use((req, res, next) => {
    RequestContext.create(orm.em, next)
    })
    //antes de las rutas y middlewares de negocio
    app.use('/api/usuarios', usuarioRouter)
    app.use('/api/tipoUsuario', tipoUsuarioRouter)
    app.use('/api/djs', djRouter)
    app.use('/api/canciones', cancionRouter)
    app.use('/api/canciondj', cancionDjRouter)

    app.use((_, res) => {
    return res.status(404).send({ message: 'Resource not found' })
    })
    return app
}

export default createServer