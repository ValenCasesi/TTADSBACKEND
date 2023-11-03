import {
    Entity,
    OneToMany,
    Property,
    Cascade,
    Collection,
} from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
  
@Entity()
export class Cancion extends BaseEntity {
    @Property({ nullable: false, unique: true })
    nombre!: string
  
    @Property({ nullable: false, unique: true })
    autor!: string
}