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
import {OpinionDj} from '../opinionDj/opinionDj.entity.js'
import {CancionDj} from '../cancionDj/cancionDj.entity.js'


@Entity()
export class Dj extends BaseEntity {
  @Property({ nullable: false, unique: true })
  nombre!: string;

  @Property({ nullable: false, unique: true })
  instagram!: string;

  @Property({ nullable: false, unique: true })
  tel!: number;

  @Property()
  actual!: boolean;

  @Property({ type: Date, nullable: false })
  fechaActual: Date = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  );

  @OneToMany(() => OpinionDj, (opinionDj) => opinionDj.dj, {
    cascade: [Cascade.ALL],
  })
  opinionDjs = new Collection<OpinionDj>(this);

  @OneToMany(() => CancionDj, (cancionDj) => cancionDj.dj, {
    cascade: [Cascade.ALL],
  })
  cancionDj = new Collection<CancionDj>(this);
}