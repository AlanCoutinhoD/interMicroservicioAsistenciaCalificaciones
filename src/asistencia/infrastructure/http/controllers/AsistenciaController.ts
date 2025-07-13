import { Request, Response } from 'express';
import { CreateAsistenciaUseCase } from '../../../application/usecases/CreateAsistenciaUseCase';
import { AsistenciaRepository } from '../../persistence/repositories/AsistenciaRepository';
import { EstadoAsistencia } from '../../../domain/enums/EstadoAsistencia';

export class AsistenciaController {
  private createUseCase: CreateAsistenciaUseCase;

  constructor() {
    const repository = new AsistenciaRepository();
    this.createUseCase = new CreateAsistenciaUseCase(repository);
  }

  async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const repository = new AsistenciaRepository();
      const asistencias = await repository.findAll();
      res.json(asistencias);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener asistencias', error });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const repository = new AsistenciaRepository();
      const asistencia = await repository.findById(id);
      if (!asistencia) {
        res.status(404).json({ message: 'Asistencia no encontrada' });
        return;
      }
      res.json(asistencia);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener la asistencia', error });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { estudiante_id, curso_id, fecha, estado, registrado_por_usuario_id } = req.body;
      const asistencia = await this.createUseCase.execute({
        estudiante_id,
        curso_id,
        fecha: new Date(fecha),
        estado: estado as EstadoAsistencia,
        registrado_por_usuario_id
      });
      res.status(201).json(asistencia);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear la asistencia', error });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const repository = new AsistenciaRepository();
      const asistencia = await repository.update(id, req.body);
      if (!asistencia) {
        res.status(404).json({ message: 'Asistencia no encontrada' });
        return;
      }
      res.json(asistencia);
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar la asistencia', error });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const repository = new AsistenciaRepository();
      const eliminado = await repository.delete(id);
      if (!eliminado) {
        res.status(404).json({ message: 'Asistencia no encontrada' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar la asistencia', error });
    }
  }
}