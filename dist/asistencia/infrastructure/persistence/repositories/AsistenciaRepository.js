"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsistenciaRepository = void 0;
const database_1 = require("../../config/database");
const Asistencia_1 = require("../../../domain/entities/Asistencia");
const AsistenciaEntity_1 = require("../entities/AsistenciaEntity");
class AsistenciaRepository {
    constructor() {
        this.repository = database_1.AppDataSource.getRepository(AsistenciaEntity_1.AsistenciaEntity);
    }
    async findAll() {
        const entities = await this.repository.find();
        return entities.map(this.toModel);
    }
    async findById(id) {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? this.toModel(entity) : null;
    }
    async create(asistencia) {
        const entity = this.repository.create(asistencia);
        const savedEntity = await this.repository.save(entity);
        return this.toModel(savedEntity);
    }
    async update(id, asistencia) {
        const entity = await this.repository.findOne({ where: { id } });
        if (!entity)
            return null;
        Object.assign(entity, asistencia);
        const updatedEntity = await this.repository.save(entity);
        return this.toModel(updatedEntity);
    }
    async delete(id) {
        const result = await this.repository.delete(id);
        return result.affected ? result.affected > 0 : false;
    }
    toModel(entity) {
        return new Asistencia_1.Asistencia(entity.id, entity.estudiante_id, entity.curso_id, entity.fecha, entity.estado, entity.registrado_por_usuario_id);
    }
}
exports.AsistenciaRepository = AsistenciaRepository;
