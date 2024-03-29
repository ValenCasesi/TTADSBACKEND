import {
    Entity,
    ManyToMany,
    Property,
    Cascade,
    Collection,
    ManyToOne,
    Rel
} from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import {Dj} from '../dj/dj.entity.js'
import {Cancion} from '../cancion/cancion.entity.js'

@Entity()
export class CancionDj extends BaseEntity {
    @Property({ nullable: false, type: String})
    fechaActual!: String

    @Property({nullable: true})
    actual!: boolean

    @Property({nullable: true})
    puntaje!: number

    @ManyToOne(() => Cancion , { nullable: false })
    cancion!: Rel<Cancion | undefined>
    
    @ManyToOne(() => Dj, { nullable: false })
    dj!: Rel<Dj>
   
}