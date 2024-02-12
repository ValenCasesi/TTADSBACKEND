var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Property, ManyToOne, OneToOne } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { tipoUsuario } from '../tipoUsuario/tipoUsuario.entity.js';
import { Dj } from '../dj/dj.entity.js';
export let Usuario = class Usuario extends BaseEntity {
};
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Usuario.prototype, "uid", void 0);
__decorate([
    Property({ nullable: true }),
    __metadata("design:type", String)
], Usuario.prototype, "nombre", void 0);
__decorate([
    Property({ nullable: true }),
    __metadata("design:type", String)
], Usuario.prototype, "mail", void 0);
__decorate([
    Property({ nullable: true }),
    __metadata("design:type", Boolean)
], Usuario.prototype, "logueado", void 0);
__decorate([
    Property({ nullable: true }),
    __metadata("design:type", Boolean)
], Usuario.prototype, "votoRealizado", void 0);
__decorate([
    ManyToOne(() => tipoUsuario, { nullable: false }),
    __metadata("design:type", Object)
], Usuario.prototype, "tipoUsuario", void 0);
__decorate([
    OneToOne(() => Dj, { nullable: true }),
    __metadata("design:type", Dj)
], Usuario.prototype, "dj", void 0);
Usuario = __decorate([
    Entity()
], Usuario);
//# sourceMappingURL=usuario.entity.js.map