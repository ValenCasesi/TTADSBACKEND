import {
    Entity,
    Property,
    Cascade,
    ManyToOne,
    Rel,
    OneToOne,
    OneToMany,
    Collection
} from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import {tipoUsuario} from '../tipoUsuario/tipoUsuario.entity.js'
import {Dj} from '../dj/dj.entity.js'
import { OpinionDj } from '../opinionDj/opinionDj.entity.js'

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
    
    @Property({nullable: false, default: false})
    votoRealizado!: boolean

    @ManyToOne(() => tipoUsuario, { nullable: false })
    tipoUsuario!: Rel<tipoUsuario>
    
    @OneToOne(() => Dj, { nullable: true, cascade: [Cascade.ALL], orphanRemoval: true,}) 
    dj!: Rel<Dj>;

    @OneToMany(() => OpinionDj, opinionDj => opinionDj.usuario, {
        cascade: [Cascade.ALL],
    })
    opinionDj = new Collection<OpinionDj>(this);
}