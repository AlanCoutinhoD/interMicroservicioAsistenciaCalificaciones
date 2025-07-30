import { Estudiante } from '../../domain/entities/Estudiante';
import { IAlumnoCursoGrupoRepository } from '../ports/output/IAlumnoCursoGrupoRepository';
import { IEstudianteRepository } from '../ports/output/IEstudianteRepository';

export class GetEstudiantesPorGrupoYAsignaturaUseCase {
    constructor(
        private readonly alumnoCursoGrupoRepository: IAlumnoCursoGrupoRepository,
        private readonly estudianteRepository: IEstudianteRepository
    ) {}

    async execute(id_grupo: number, id_asignatura: number): Promise<Estudiante[]> {
        // Obtener las relaciones alumno-curso-grupo
        const alumnosCursoGrupo = await this.alumnoCursoGrupoRepository.findByGrupoYAsignatura(id_grupo, id_asignatura);
        
        // Extraer los IDs de estudiantes
        const estudianteIds = alumnosCursoGrupo.map(acg => acg.id_estudiante);
        
        if (estudianteIds.length === 0) {
            return [];
        }
        
        // Obtener los datos de los estudiantes
        const estudiantes = await this.estudianteRepository.findByIds(estudianteIds);
        
        return estudiantes;
    }
}