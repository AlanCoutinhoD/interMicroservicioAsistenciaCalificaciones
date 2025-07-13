import { Asistencia } from '../../../domain/entities/Asistencia';

export interface IAsistenciaRepository {
  findAll(): Promise<Asistencia[]>;
  findById(id: number): Promise<Asistencia | null>;
  create(asistencia: Omit<Asistencia, 'id'>): Promise<Asistencia>;
  update(id: number, asistencia: Partial<Asistencia>): Promise<Asistencia | null>;
  delete(id: number): Promise<boolean>;
}