import { Request, Response } from 'express';
import { CreateAsistenciaTutoradoUseCase } from '../../../application/usecases/CreateAsistenciaTutoradoUseCase';
import { AsistenciaTutoradoRepository } from '../../persistence/repositories/AsistenciaTutoradoRepository';
import { AsistenciaTutorado } from '../../../domain/entities/AsistenciaTutorado';

export class AsistenciaTutoradoController {
    private createUseCase: CreateAsistenciaTutoradoUseCase;
    private repository: AsistenciaTutoradoRepository;

    constructor() {
        this.repository = new AsistenciaTutoradoRepository();
        this.createUseCase = new CreateAsistenciaTutoradoUseCase(this.repository);
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const asistencia = new AsistenciaTutorado(
                0,
                req.body.tutor_id,
                new Date(req.body.fecha),
                req.body.estado
            );
            const result = await this.createUseCase.execute(asistencia);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error al crear la asistencia del tutorado' });
        }
    }

    async getAll(_req: Request, res: Response): Promise<void> {
        try {
            const asistencias = await this.repository.findAll();
            res.json(asistencias);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener las asistencias' });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const asistencia = await this.repository.findById(id);
            if (asistencia) {
                res.json(asistencia);
            } else {
                res.status(404).json({ message: 'Asistencia no encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener la asistencia' });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const asistencia = new AsistenciaTutorado(
                id,
                req.body.tutor_id,
                new Date(req.body.fecha),
                req.body.estado
            );
            const updated = await this.repository.update(id, asistencia);
            if (updated) {
                res.json(updated);
            } else {
                res.status(404).json({ message: 'Asistencia no encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar la asistencia' });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const deleted = await this.repository.delete(id);
            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: 'Asistencia no encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar la asistencia' });
        }
    }
}