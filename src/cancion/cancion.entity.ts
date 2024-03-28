import {
    Entity,
    OneToMany,
    Property,
    Cascade,
    Collection,
} from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import {CancionDj} from '../cancionDj/cancionDj.entity.js' 

@Entity()
export class Cancion extends BaseEntity {
    @Property({ nullable: false, unique: true })
    nombre!: string
  
    @Property({ nullable: false, unique: true })
    autor!: string

    @Property({ nullable: true })
    puntajeTotal!: number

    @OneToMany(() => CancionDj, (cancionDj) => cancionDj.cancion, {
        cascade: [Cascade.ALL],
        orphanRemoval: true,
      })
      cancionDj = new Collection<CancionDj>(this)
    
}