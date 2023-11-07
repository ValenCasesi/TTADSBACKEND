import {
    Entity,
    OneToMany,
    Property,
    Cascade,
    Collection,
    ManyToOne,
    Rel
} from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import {Dj} from '../dj/dj.entity.js'

@Entity()
export class OpinionDj extends BaseEntity {
    @Property({ nullable: false})
    opinion!: string
    
    @ManyToOne(() => Dj, { nullable: false })
    dj!: Rel<Dj>
}