import { Asistencia } from '../../domain/entities/Asistencia';
import { IAsistenciaRepository } from '../ports/output/IAsistenciaRepository';

export class CreateAsistenciaUseCase {
  constructor(private readonly asistenciaRepository: IAsistenciaRepository) {}

  async execute(asistencia: Omit<Asistencia, 'id'>): Promise<Asistencia> {
    return this.asistenciaRepository.create(asistencia);
  }
}