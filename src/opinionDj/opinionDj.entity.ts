import {
    Entity,
    Property,
    ManyToOne,
    Rel,
} from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import {Dj} from '../dj/dj.entity.js'
import { Usuario } from '../usuario/usuario.entity.js'

@Entity()
export class OpinionDj extends BaseEntity {
    @Property({ nullable: false})
    opinion!: string

    @ManyToOne(() => Usuario, { nullable: false })
    usuario!: Rel<Usuario>
    
    @ManyToOne(() => Dj, { nullable: false })
    dj!: Rel<Dj>
}