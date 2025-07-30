import { Repository } from 'typeorm';
import { AppDataSource } from '../../../../shared/infrastructure/config/databases';
import { AsistenciaTutorado } from '../../../domain/entities/AsistenciaTutorado';
import { IAsistenciaTutoradoRepository } from '../../../application/ports/output/IAsistenciaTutoradoRepository';
import { AsistenciaTutoradoEntity } from '../entities/AsistenciaTutoradoEntity';

export class AsistenciaTutoradoRepository implements IAsistenciaTutoradoRepository {
    private repository: Repository<AsistenciaTutoradoEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(AsistenciaTutoradoEntity);
    }

    async save(asistencia: AsistenciaTutorado): Promise<AsistenciaTutorado> {
        const entity = new AsistenciaTutoradoEntity({
            tutor_academico: asistencia.tutorAcademico,
            matricula_estudiante: asistencia.matriculaEstudiante,
            nombre_estudiante: asistencia.nombreEstudiante,
            carrera_estudiante: asistencia.carreraEstudiante,
            fecha: asistencia.fecha,
            estado: asistencia.estado,
            observaciones: asistencia.observaciones
        });
        const savedEntity = await this.repository.save(entity);
        return this.mapToAsistencia(savedEntity);
    }

    async findAll(): Promise<AsistenciaTutorado[]> {
        const entities = await this.repository.find();
        return entities.map(entity => this.mapToAsistencia(entity));
    }

    async findById(id: number): Promise<AsistenciaTutorado | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? this.mapToAsistencia(entity) : null;
    }

    async update(id: number, asistencia: AsistenciaTutorado): Promise<AsistenciaTutorado | null> {
        const entity = await this.repository.findOne({ where: { id } });
        if (!entity) return null;

        entity.tutor_academico = asistencia.tutorAcademico;
        entity.matricula_estudiante = asistencia.matriculaEstudiante;
        entity.nombre_estudiante = asistencia.nombreEstudiante;
        entity.carrera_estudiante = asistencia.carreraEstudiante;
        entity.fecha = asistencia.fecha;
        entity.estado = asistencia.estado;
        entity.observaciones = asistencia.observaciones;

        const updatedEntity = await this.repository.save(entity);
        return this.mapToAsistencia(updatedEntity);
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.repository.delete(id);
        return result.affected ? result.affected > 0 : false;
    }

    // Métodos específicos para pasar lista
    async findByTutorAndFecha(tutorAcademico: string, fecha: Date): Promise<AsistenciaTutorado[]> {
        const startOfDay = new Date(fecha);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(fecha);
        endOfDay.setHours(23, 59, 59, 999);

        const entities = await this.repository.find({
            where: {
                tutor_academico: tutorAcademico,
                fecha: startOfDay // En MySQL, las fechas se comparan por día completo
            },
            order: {
                nombre_estudiante: 'ASC'
            }
        });

        return entities.map(entity => this.mapToAsistencia(entity));
    }

    async findByMatriculaAndFecha(matricula: string, fecha: Date): Promise<AsistenciaTutorado | null> {
        const startOfDay = new Date(fecha);
        startOfDay.setHours(0, 0, 0, 0);

        const entity = await this.repository.findOne({
            where: {
                matricula_estudiante: matricula,
                fecha: startOfDay
            }
        });

        return entity ? this.mapToAsistencia(entity) : null;
    }

    async getHistorialByTutor(tutorAcademico: string, limit: number = 50): Promise<AsistenciaTutorado[]> {
        const entities = await this.repository.find({
            where: {
                tutor_academico: tutorAcademico
            },
            order: {
                fecha: 'DESC',
                nombre_estudiante: 'ASC'
            },
            take: limit
        });

        return entities.map(entity => this.mapToAsistencia(entity));
    }

    private mapToAsistencia(entity: AsistenciaTutoradoEntity): AsistenciaTutorado {
        return new AsistenciaTutorado(
            entity.id,
            entity.tutor_academico,
            entity.matricula_estudiante,
            entity.nombre_estudiante,
            entity.carrera_estudiante,
            entity.fecha,
            entity.estado,
            entity.observaciones,
            entity.created_at
        );
    }
}