import { Request, Response } from 'express';
import { CreateCalificacionUseCase } from '../../../application/usecases/CreateCalificacionUseCase';
import { CalificacionRepository } from '../../persistence/repositories/CalificacionRepository';

export class CalificacionController {
    private createUseCase: CreateCalificacionUseCase;

    constructor() {
        const repository = new CalificacionRepository();
        this.createUseCase = new CreateCalificacionUseCase(repository);
    }

    async getAll(_req: Request, res: Response): Promise<void> {
        try {
            const repository = new CalificacionRepository();
            const calificaciones = await repository.findAll();
            res.json(calificaciones);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener calificaciones', error });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const repository = new CalificacionRepository();
            const calificacion = await repository.findById(id);
            if (!calificacion) {
                res.status(404).json({ message: 'Calificación no encontrada' });
                return;
            }
            res.json(calificacion);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener la calificación', error });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const calificacion = await this.createUseCase.execute(req.body);
            res.status(201).json(calificacion);
        } catch (error) {
            res.status(500).json({ message: 'Error al crear la calificación', error });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const repository = new CalificacionRepository();
            const calificacion = await repository.update(id, req.body);
            if (!calificacion) {
                res.status(404).json({ message: 'Calificación no encontrada' });
                return;
            }
            res.json(calificacion);
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar la calificación', error });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const repository = new CalificacionRepository();
            const eliminado = await repository.delete(id);
            if (!eliminado) {
                res.status(404).json({ message: 'Calificación no encontrada' });
                return;
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar la calificación', error });
        }
    }
}