var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, OneToMany, Property, Cascade, Collection } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { OpinionDj } from '../opinionDj/opinionDj.entity.js';
import { CancionDj } from '../cancionDj/cancionDj.entity.js';
export let Dj = class Dj extends BaseEntity {
    constructor() {
        super(...arguments);
        this.fechaActual = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
        this.opinionDjs = new Collection(this);
        this.cancionDj = new Collection(this);
        // @OneToOne(() => Usuario, { nullable: true }) 
        //   usuario!: Usuario;
    }
};
__decorate([
    Property({ nullable: false, unique: true }),
    __metadata("design:type", String)
], Dj.prototype, "nombre", void 0);
__decorate([
    Property({ nullable: false, unique: true }),
    __metadata("design:type", String)
], Dj.prototype, "instagram", void 0);
__decorate([
    Property({ nullable: false, unique: true }),
    __metadata("design:type", Number)
], Dj.prototype, "tel", void 0);
__decorate([
    Property(),
    __metadata("design:type", Boolean)
], Dj.prototype, "actual", void 0);
__decorate([
    Property({ type: Date, nullable: false }),
    __metadata("design:type", Date)
], Dj.prototype, "fechaActual", void 0);
__decorate([
    OneToMany(() => OpinionDj, (opinionDj) => opinionDj.dj, {
        cascade: [Cascade.ALL],
    }),
    __metadata("design:type", Object)
], Dj.prototype, "opinionDjs", void 0);
__decorate([
    OneToMany(() => CancionDj, (cancionDj) => cancionDj.dj, {
        cascade: [Cascade.ALL],
    }),
    __metadata("design:type", Object)
], Dj.prototype, "cancionDj", void 0);
Dj = __decorate([
    Entity()
], Dj);
//# sourceMappingURL=dj.entity.js.map