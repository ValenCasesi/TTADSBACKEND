import 'reflect-metadata'
import express from 'express'
import { usuarioRouter } from './usuario/usuario.routes.js'
import { tipoUsuarioRouter } from './tipoUsuario/tipoUsuario.routes.js'
import { djRouter} from './dj/dj.routes.js'
import { cancionRouter } from './cancion/cancion.routes.js'
import { cancionDjRouter } from './cancionDj/cancionDj.routes.js'
import { orm } from './shared/db/orm.js'
import { RequestContext } from '@mikro-orm/core'
import cors from 'cors'
import createServer from './utils/server.js'
import { Usuario } from './usuario/usuario.entity.js'
import { tipoUsuario } from './tipoUsuario/tipoUsuario.entity.js'

// const port = process.env.PORT 
// const app = express()
// app.use(express.json())
// app.use(cors())
// //luego de los middlewares base
// app.use((req, res, next) => {
//   RequestContext.create(orm.em, next)
// })
// //antes de las rutas y middlewares de negocio
// app.use('/api/usuarios', usuarioRouter)
// app.use('/api/tipoUsuario', tipoUsuarioRouter)
// app.use('/api/djs', djRouter)
// app.use('/api/canciones', cancionRouter)
// app.use('/api/canciondj', cancionDjRouter)

// app.use((_, res) => {
//   return res.status(404).send({ message: 'Resource not found' })
// })
const app = createServer()
//await syncSchema() //never in production

app.listen(3000, async() => {
  console.log('\x1b[32m%s\x1b[0m','\n Servidor corriendo en el puerto:','\x1b[34m' + '3000' + '\x1b[0m')


  // Verifica si existen los tipoUsuario 'Cliente', 'Dj' y 'Admin' en la base de datos
  const em = orm.em.fork();
  const cliente = await em.findOne(tipoUsuario, { rol: 'Cliente' });
  const dj = await em.findOne(tipoUsuario, { rol: 'Dj' });
  const admin = await em.findOne(tipoUsuario, { rol: 'Admin' });

  // Si no existen los tipoUsuario, créelos
  if (!cliente) {
    em.create(tipoUsuario, { rol: 'Cliente' });
    await em.flush();
    console.log('\x1b[34m' + '\nTipo de usuario Cliente creado' + '\x1b[0m');
  }
  if (!dj) {
    em.create(tipoUsuario, { rol: 'Dj' });
    await em.flush();
    console.log('\x1b[34m' + '\nTipo de usuario Dj creado' + '\x1b[0m');
  }
  if (!admin) {
    em.create(tipoUsuario, { rol: 'Admin' });
    await em.flush();
    console.log('\x1b[34m' + '\nTipo de usuario Admin creado' + '\x1b[0m');
  }

  // Verifica si el usuario 'admin' existe en la base de datos
  const tipoAdmin = await em.findOne(tipoUsuario, { rol: 'Admin' });
  const usuarioAdmin = await em.findOne(Usuario, { tipoUsuario: tipoAdmin });
  // Si el usuario 'admin' no existe se crea
  if (!usuarioAdmin && tipoAdmin) {
    const nuevoAdmin = new Usuario();
    nuevoAdmin.mail= 'juanicampora@gmail.com';
    nuevoAdmin.tipoUsuario = tipoAdmin;
    await em.persistAndFlush(nuevoAdmin);
    console.log('\x1b[34m' + '\n Usuario admin creado' + '\x1b[0m');
  }
})
