import { Repository } from 'typeorm';
import { CursosDataSource, AlumnosDataSource } from '../../../../shared/infrastructure/config/databases';
import { AsistenciaEstudiante } from '../../../domain/entities/AsistenciaEstudiante';
import { IAsistenciaEstudianteRepository } from '../../../application/ports/output/IAsistenciaEstudianteRepository';
import { AsistenciaEstudianteEntity } from '../entities/AsistenciaEstudianteEntity';
import { PaseListaDto } from '../../../domain/dtos/PaseListaDto';

export class AsistenciaEstudianteRepository implements IAsistenciaEstudianteRepository {
    private asistenciaRepository: Repository<AsistenciaEstudianteEntity>;

    constructor() {
        this.asistenciaRepository = CursosDataSource.getRepository(AsistenciaEstudianteEntity);
    }

    async saveMultiple(asistencias: AsistenciaEstudiante[]): Promise<AsistenciaEstudiante[]> {
        const entities = asistencias.map(asistencia => 
            new AsistenciaEstudianteEntity({
                id_alumno: asistencia.id_alumno,
                id_grupo: asistencia.id_grupo,
                id_asignatura: asistencia.id_asignatura,
                estado: asistencia.estado,
                fecha: asistencia.fecha
            })
        );

        const savedEntities = await this.asistenciaRepository.save(entities);
        return savedEntities.map(entity => this.mapToAsistencia(entity));
    }

    async getPaseListaByFechaGrupoAsignatura(fecha: string, id_grupo: number, id_asignatura: number): Promise<PaseListaDto[]> {
        // Primero obtenemos los alumnos del grupo y asignatura desde la base de cursos
        const alumnosQuery = `
            SELECT DISTINCT acg.id_estudiante as id_alumno
            FROM alumno_curso_grupo acg
            WHERE acg.id_grupo = ? AND acg.id_asignatura = ?
        `;
        
        const alumnosResult = await CursosDataSource.query(alumnosQuery, [id_grupo, id_asignatura]);
        
        if (alumnosResult.length === 0) {
            return [];
        }

        const alumnoIds = alumnosResult.map((row: any) => row.id_alumno);
        
        // Obtenemos los datos de los estudiantes desde la base de alumnos
        const estudiantesQuery = `
            SELECT id, matricula, nombre, email
            FROM estudiantes
            WHERE id IN (${alumnoIds.map(() => '?').join(',')})
        `;
        
        const estudiantes = await AlumnosDataSource.query(estudiantesQuery, alumnoIds);
        
        // Obtenemos las asistencias del día específico
        const asistenciasQuery = `
            SELECT id_asistencia, id_alumno, estado
            FROM asistencia
            WHERE DATE(fecha) = ? AND id_grupo = ? AND id_asignatura = ?
        `;
        
        const asistencias = await CursosDataSource.query(asistenciasQuery, [fecha, id_grupo, id_asignatura]);
        
        // Combinamos los datos
        const paseListaMap = new Map();
        
        // Agregamos todos los estudiantes
        estudiantes.forEach((estudiante: any) => {
            paseListaMap.set(estudiante.id, {
                id_asistencia: null,
                id_alumno: estudiante.id,
                matricula: estudiante.matricula,
                nombre: estudiante.nombre,
                email: estudiante.email,
                estado: 'Sin registrar'
            });
        });
        
        // Actualizamos con las asistencias registradas
        asistencias.forEach((asistencia: any) => {
            if (paseListaMap.has(asistencia.id_alumno)) {
                const registro = paseListaMap.get(asistencia.id_alumno);
                registro.id_asistencia = asistencia.id_asistencia;
                registro.estado = asistencia.estado;
            }
        });
        
        return Array.from(paseListaMap.values());
    }

    private mapToAsistencia(entity: AsistenciaEstudianteEntity): AsistenciaEstudiante {
        return new AsistenciaEstudiante(
            entity.id_asistencia,
            entity.id_alumno,
            entity.id_grupo,
            entity.id_asignatura,
            entity.estado,
            entity.fecha
        );
    }
}