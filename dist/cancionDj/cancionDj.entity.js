var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Dj } from '../dj/dj.entity.js';
import { Cancion } from '../cancion/cancion.entity.js';
export let CancionDj = class CancionDj extends BaseEntity {
    constructor() {
        super(...arguments);
        this.fechaActual = new Date();
    }
};
__decorate([
    Property({ nullable: false, type: Date }),
    __metadata("design:type", Date)
], CancionDj.prototype, "fechaActual", void 0);
__decorate([
    Property({ nullable: true }),
    __metadata("design:type", Boolean)
], CancionDj.prototype, "actual", void 0);
__decorate([
    Property({ nullable: true }),
    __metadata("design:type", Number)
], CancionDj.prototype, "puntaje", void 0);
__decorate([
    ManyToOne(() => Cancion, { nullable: false }),
    __metadata("design:type", Object)
], CancionDj.prototype, "cancion", void 0);
__decorate([
    ManyToOne(() => Dj, { nullable: false }),
    __metadata("design:type", Object)
], CancionDj.prototype, "dj", void 0);
CancionDj = __decorate([
    Entity()
], CancionDj);
//# sourceMappingURL=cancionDj.entity.js.map