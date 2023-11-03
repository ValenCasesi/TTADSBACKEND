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
import {opinionDj} from '../opinionDj/opinionDj.entity.js'
@Entity()
export class Dj extends BaseEntity {
    @Property({ nullable: false, unique: true })
    nombre!: string
  
    @Property({ nullable: false, unique: true })
    instagram!: string

    @Property({ nullable: false, unique: true })
    tel!: number

    @Property()
    actual!: boolean

    @OneToMany(() => opinionDj, (opinionDj) => opinionDj.Dj, {
        cascade: [Cascade.ALL],
      })
      opinionDjs = new Collection<opinionDj>(this)

}