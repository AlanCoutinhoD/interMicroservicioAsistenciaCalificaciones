import { Asistencia } from '../../../domain/entities/Asistencia';

export interface IAsistenciaService {
  obtenerTodas(): Promise<Asistencia[]>;
  obtenerPorId(id: number): Promise<Asistencia | null>;
  crear(asistencia: Omit<Asistencia, 'id'>): Promise<Asistencia>;
  actualizar(id: number, asistencia: Partial<Asistencia>): Promise<Asistencia | null>;
  eliminar(id: number): Promise<boolean>;
}