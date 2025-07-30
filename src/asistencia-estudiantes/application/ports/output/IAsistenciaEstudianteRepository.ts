import { AsistenciaEstudiante } from '../../../domain/entities/AsistenciaEstudiante';
import { PaseListaDto } from '../../../domain/dtos/PaseListaDto';

export interface IAsistenciaEstudianteRepository {
    saveMultiple(asistencias: AsistenciaEstudiante[]): Promise<AsistenciaEstudiante[]>;
    getPaseListaByFechaGrupoAsignatura(fecha: string, id_grupo: number, id_asignatura: number): Promise<PaseListaDto[]>;
}