import { AsistenciaEstudiante } from '../../domain/entities/AsistenciaEstudiante';
import { RegistroAsistenciasRequest } from '../../domain/dtos/RegistroAsistenciaDto';
import { IAsistenciaEstudianteRepository } from '../ports/output/IAsistenciaEstudianteRepository';

export class RegistrarAsistenciasUseCase {
    constructor(private readonly repository: IAsistenciaEstudianteRepository) {}

    async execute(request: RegistroAsistenciasRequest): Promise<AsistenciaEstudiante[]> {
        const asistencias = request.asistencias.map(asistencia => 
            new AsistenciaEstudiante(
                0, // Se generará automáticamente
                asistencia.id_alumno,
                request.id_grupo,
                request.id_asignatura,
                asistencia.estado,
                new Date(request.fecha)
            )
        );

        return await this.repository.saveMultiple(asistencias);
    }
}