import 'reflect-metadata'
import express from 'express'
import { djRouter } from './dj/dj.routes.js'
import { orm } from './shared/db/orm.js'
import { RequestContext } from '@mikro-orm/core'
import cors from 'cors'

const port = process.env.PORT 
const app = express()
app.use(express.json())
app.use(cors())
//luego de los middlewares base
app.use((req, res, next) => {
  RequestContext.create(orm.em, next)
})
//antes de las rutas y middlewares de negocio

app.use('/api/djs', djRouter)

app.use((_, res) => {
  return res.status(404).send({ message: 'Resource not found' })
})

//await syncSchema() //never in production

app.listen(3000, () => {
  console.log('Server runnning on port')
})
