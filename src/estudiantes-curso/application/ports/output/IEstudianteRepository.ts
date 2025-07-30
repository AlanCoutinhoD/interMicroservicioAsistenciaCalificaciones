import { Estudiante } from '../../../domain/entities/Estudiante';

export interface IEstudianteRepository {
    findByIds(ids: number[]): Promise<Estudiante[]>;
}