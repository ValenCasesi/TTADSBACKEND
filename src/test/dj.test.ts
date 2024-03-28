import supertest from 'supertest'
import createServer from '../utils/server'

const app = createServer()

describe('dj',()=>{
    describe('get dj route', () => {
        describe('dame dj q no exista', () => {
            it('espero respuesta 404',() =>{
                const idDj = '65fb5f1601280b57f09fde70'
                supertest(app).get(`api/djs/$(idDj)`).expect(404)
            })
        })
    })
})