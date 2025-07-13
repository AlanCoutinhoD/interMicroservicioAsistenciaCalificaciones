"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsistenciaEntity = void 0;
const typeorm_1 = require("typeorm");
const EstadoAsistencia_1 = require("../../../domain/enums/EstadoAsistencia");
let AsistenciaEntity = class AsistenciaEntity {
    constructor(partial) {
        Object.assign(this, partial);
    }
};
exports.AsistenciaEntity = AsistenciaEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AsistenciaEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], AsistenciaEntity.prototype, "estudiante_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], AsistenciaEntity.prototype, "curso_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], AsistenciaEntity.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EstadoAsistencia_1.EstadoAsistencia,
        default: EstadoAsistencia_1.EstadoAsistencia.Presente
    }),
    __metadata("design:type", String)
], AsistenciaEntity.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], AsistenciaEntity.prototype, "registrado_por_usuario_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AsistenciaEntity.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AsistenciaEntity.prototype, "updated_at", void 0);
exports.AsistenciaEntity = AsistenciaEntity = __decorate([
    (0, typeorm_1.Entity)('registros_asistencia'),
    __metadata("design:paramtypes", [Object])
], AsistenciaEntity);
