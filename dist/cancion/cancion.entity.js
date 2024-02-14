var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, OneToMany, Property, Cascade, Collection, } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { CancionDj } from '../cancionDj/cancionDj.entity.js';
export let Cancion = class Cancion extends BaseEntity {
    constructor() {
        super(...arguments);
        this.cancionDj = new Collection(this);
    }
};
__decorate([
    Property({ nullable: false, unique: true }),
    __metadata("design:type", String)
], Cancion.prototype, "nombre", void 0);
__decorate([
    Property({ nullable: false, unique: true }),
    __metadata("design:type", String)
], Cancion.prototype, "autor", void 0);
__decorate([
    OneToMany(() => CancionDj, (cancionDj) => cancionDj.cancion, {
        cascade: [Cascade.ALL],
        orphanRemoval: true,
    }),
    __metadata("design:type", Object)
], Cancion.prototype, "cancionDj", void 0);
Cancion = __decorate([
    Entity()
], Cancion);
//# sourceMappingURL=cancion.entity.js.map