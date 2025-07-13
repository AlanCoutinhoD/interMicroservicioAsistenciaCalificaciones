import { Calificacion } from '../entities/Calificacion';

export interface ICalificacionRepository {
    findAll(): Promise<Calificacion[]>;
    findById(id: number): Promise<Calificacion | null>;
    create(calificacion: Omit<Calificacion, 'id'>): Promise<Calificacion>;
    update(id: number, calificacion: Partial<Calificacion>): Promise<Calificacion | null>;
    delete(id: number): Promise<boolean>;
}