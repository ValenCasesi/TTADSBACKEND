import {
    Entity,
    OneToMany,
    Property,
    Cascade,
    Collection,
} from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import {Usuario} from '../usuario/usuario.entity.js' 

@Entity()
export class tipoUsuario extends BaseEntity {
    @Property({ nullable: false, unique: true })
    rol!: string

    @OneToMany(() => Usuario, (usuario) => usuario.tipoUsuario, {
        cascade: [Cascade.ALL],
        orphanRemoval: true,
      })
      usuario = new Collection<Usuario>(this)
    
}