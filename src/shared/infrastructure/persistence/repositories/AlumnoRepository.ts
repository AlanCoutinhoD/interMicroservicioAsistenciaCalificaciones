import { Repository } from 'typeorm';
import { AlumnosDataSource } from '../../config/databases';
import { AlumnoEntity } from '../entities/AlumnoEntity';
import { Alumno } from '../../../domain/entities/Alumno';

export class AlumnoRepository {
    private repository: Repository<AlumnoEntity>;

    constructor() {
        this.repository = AlumnosDataSource.getRepository(AlumnoEntity);
    }

    async findByTutorAcademico(tutorId: string): Promise<Alumno[]> {
        try {
            // Usamos una subconsulta para evitar problemas con GROUP BY
            const subQuery = this.repository
                .createQueryBuilder('sub')
                .select('MIN(sub.id)', 'min_id')
                .where('sub.tutorAcademico = :tutorId', { tutorId })
                .andWhere('sub.estatusAlumno = :estatus', { estatus: 'Activo' })
                .groupBy('sub.matricula');

            const entities = await this.repository
                .createQueryBuilder('estudiante')
                .select([
                    'estudiante.id',
                    'estudiante.matricula',
                    'estudiante.nombre',
                    'estudiante.carrera',
                    'estudiante.estatusAlumno',
                    'estudiante.cuatrimestreActual',
                    'estudiante.grupoActual',
                    'estudiante.materia',
                    'estudiante.periodo',
                    'estudiante.tutorAcademico'
                ])
                .where(`estudiante.id IN (${subQuery.getQuery()})`)
                .setParameters(subQuery.getParameters())
                .getMany();

            return entities.map(entity => this.mapToAlumno(entity));
        } catch (error) {
            console.error('Error al obtener alumnos por tutor académico:', error);
            throw new Error('Error al obtener la lista de tutorados');
        }
    }

    async findAll(): Promise<Alumno[]> {
        try {
            const entities = await this.repository.find();
            return entities.map(entity => this.mapToAlumno(entity));
        } catch (error) {
            console.error('Error al obtener todos los alumnos:', error);
            throw new Error('Error al obtener la lista de alumnos');
        }
    }

    private mapToAlumno(entity: AlumnoEntity): Alumno {
        return new Alumno(
            entity.id,
            entity.matricula,
            entity.nombre,
            entity.carrera,
            entity.estatusAlumno,
            entity.cuatrimestreActual,
            entity.grupoActual,
            entity.materia,
            entity.periodo,
            entity.estatusMateria,
            entity.final,
            entity.extra,
            entity.estatusCardex,
            entity.periodoCursado,
            entity.planEstudiosClave,
            entity.creditos,
            entity.tutorAcademico,
            entity.createdAt,
            entity.updatedAt
        );
    }
}
