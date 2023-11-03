var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Property, } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
export let Dj = class Dj extends BaseEntity {
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
Dj = __decorate([
    Entity()
], Dj);
//# sourceMappingURL=dj.entity.js.map