import { AsistenciaTutorado } from '../../../domain/entities/AsistenciaTutorado';

export interface IAsistenciaTutoradoRepository {
    save(asistencia: AsistenciaTutorado): Promise<AsistenciaTutorado>;
    findAll(): Promise<AsistenciaTutorado[]>;
    findById(id: number): Promise<AsistenciaTutorado | null>;
    update(id: number, asistencia: AsistenciaTutorado): Promise<AsistenciaTutorado | null>;
    delete(id: number): Promise<boolean>;
    
    // Métodos específicos para pasar lista
    findByTutorAndFecha(tutorAcademico: string, fecha: Date): Promise<AsistenciaTutorado[]>;
    findByMatriculaAndFecha(matricula: string, fecha: Date): Promise<AsistenciaTutorado | null>;
    getHistorialByTutor(tutorAcademico: string, limit?: number): Promise<AsistenciaTutorado[]>;
}