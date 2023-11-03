import {
    Entity,
    OneToMany,
    Property,
    Cascade,
    Collection,
} from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
  
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

}