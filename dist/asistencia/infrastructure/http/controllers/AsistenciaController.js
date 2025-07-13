"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsistenciaController = void 0;
const CreateAsistenciaUseCase_1 = require("../../../application/usecases/CreateAsistenciaUseCase");
const AsistenciaRepository_1 = require("../../persistence/repositories/AsistenciaRepository");
class AsistenciaController {
    constructor() {
        const repository = new AsistenciaRepository_1.AsistenciaRepository();
        this.createUseCase = new CreateAsistenciaUseCase_1.CreateAsistenciaUseCase(repository);
    }
    async getAll(req, res) {
        try {
            const repository = new AsistenciaRepository_1.AsistenciaRepository();
            const asistencias = await repository.findAll();
            res.json(asistencias);
        }
        catch (error) {
            res.status(500).json({ message: 'Error al obtener asistencias', error });
        }
    }
    async getById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const repository = new AsistenciaRepository_1.AsistenciaRepository();
            const asistencia = await repository.findById(id);
            if (!asistencia) {
                return res.status(404).json({ message: 'Asistencia no encontrada' });
            }
            res.json(asistencia);
        }
        catch (error) {
            res.status(500).json({ message: 'Error al obtener la asistencia', error });
        }
    }
    async create(req, res) {
        try {
            const { estudiante_id, curso_id, fecha, estado, registrado_por_usuario_id } = req.body;
            const asistencia = await this.createUseCase.execute({
                estudiante_id,
                curso_id,
                fecha: new Date(fecha),
                estado: estado,
                registrado_por_usuario_id
            });
            res.status(201).json(asistencia);
        }
        catch (error) {
            res.status(500).json({ message: 'Error al crear la asistencia', error });
        }
    }
    async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            const repository = new AsistenciaRepository_1.AsistenciaRepository();
            const asistencia = await repository.update(id, req.body);
            if (!asistencia) {
                return res.status(404).json({ message: 'Asistencia no encontrada' });
            }
            res.json(asistencia);
        }
        catch (error) {
            res.status(500).json({ message: 'Error al actualizar la asistencia', error });
        }
    }
    async delete(req, res) {
        try {
            const id = parseInt(req.params.id);
            const repository = new AsistenciaRepository_1.AsistenciaRepository();
            const eliminado = await repository.delete(id);
            if (!eliminado) {
                return res.status(404).json({ message: 'Asistencia no encontrada' });
            }
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ message: 'Error al eliminar la asistencia', error });
        }
    }
}
exports.AsistenciaController = AsistenciaController;
