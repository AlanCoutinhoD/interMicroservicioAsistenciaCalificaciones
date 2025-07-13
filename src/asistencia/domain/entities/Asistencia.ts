import { EstadoAsistencia } from '../enums/EstadoAsistencia';

export class Asistencia {
  constructor(
    public readonly id: number,
    public estudiante_id: number,
    public curso_id: number,
    public fecha: Date,
    public estado: EstadoAsistencia,
    public registrado_por_usuario_id: number
  ) {}
}