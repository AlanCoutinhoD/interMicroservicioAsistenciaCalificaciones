import { AsistenciaTutorado } from '../../domain/entities/AsistenciaTutorado';
import { EstadoAsistenciaTutorado } from '../../domain/enums/EstadoAsistenciaTutorado';
import { IAsistenciaTutoradoRepository } from '../ports/output/IAsistenciaTutoradoRepository';
import { AlumnoRepository } from '../../../shared/infrastructure/persistence/repositories/AlumnoRepository';

export interface PasarListaRequest {
    tutorAcademico: string;
    fecha: Date;
    asistencias: {
        matricula: string;
        estado: EstadoAsistenciaTutorado;
        observaciones?: string;
    }[];
}

export class PasarListaTutoradoUseCase {
    constructor(
        private readonly asistenciaRepository: IAsistenciaTutoradoRepository,
        private readonly alumnoRepository: AlumnoRepository
    ) {}

    async execute(request: PasarListaRequest): Promise<AsistenciaTutorado[]> {
        const resultados: AsistenciaTutorado[] = [];

        // Obtener información de los estudiantes
        const estudiantes = await this.alumnoRepository.findByTutorAcademico(request.tutorAcademico);
        const estudiantesMap = new Map(estudiantes.map(est => [est.matricula, est]));

        for (const asistenciaData of request.asistencias) {
            const estudiante = estudiantesMap.get(asistenciaData.matricula);
            
            if (!estudiante) {
                throw new Error(`Estudiante con matrícula ${asistenciaData.matricula} no encontrado para el tutor ${request.tutorAcademico}`);
            }

            // Verificar si ya existe un registro para esta fecha y matrícula
            const existente = await this.asistenciaRepository.findByMatriculaAndFecha(
                asistenciaData.matricula, 
                request.fecha
            );

            let asistencia: AsistenciaTutorado;

            if (existente) {
                // Actualizar registro existente
                asistencia = new AsistenciaTutorado(
                    existente.id,
                    request.tutorAcademico,
                    asistenciaData.matricula,
                    estudiante.nombre,
                    estudiante.carrera,
                    request.fecha,
                    asistenciaData.estado,
                    asistenciaData.observaciones,
                    existente.createdAt
                );
                
                asistencia = await this.asistenciaRepository.update(existente.id, asistencia) || asistencia;
            } else {
                // Crear nuevo registro
                asistencia = new AsistenciaTutorado(
                    0,
                    request.tutorAcademico,
                    asistenciaData.matricula,
                    estudiante.nombre,
                    estudiante.carrera,
                    request.fecha,
                    asistenciaData.estado,
                    asistenciaData.observaciones
                );
                
                asistencia = await this.asistenciaRepository.save(asistencia);
            }

            resultados.push(asistencia);
        }

        return resultados;
    }
}
