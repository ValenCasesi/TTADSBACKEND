import {
    Entity,
    Property,
    ManyToOne,
    Rel,
    OneToOne
} from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import {tipoUsuario} from '../tipoUsuario/tipoUsuario.entity.js'
import {Dj} from '../dj/dj.entity.js'

@Entity()
export class Usuario extends BaseEntity {
    @Property({ nullable: true})
    uid!: string

    @Property({nullable: true})
    nombre!: string

    @Property({nullable: true})
    mail!: string

    @Property({nullable: true})
    logueado!: boolean
    
    @Property({nullable: true})
    votoRealizado!: boolean

    @ManyToOne(() => tipoUsuario, { nullable: false })
    tipoUsuario!: Rel<tipoUsuario>
    
    @OneToOne(() => Dj, { nullable: true }) 
    dj!: Dj;
}