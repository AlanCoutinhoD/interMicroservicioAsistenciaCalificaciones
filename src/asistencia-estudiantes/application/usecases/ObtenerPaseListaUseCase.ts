import { PaseListaDto } from '../../domain/dtos/PaseListaDto';
import { IAsistenciaEstudianteRepository } from '../ports/output/IAsistenciaEstudianteRepository';

export class ObtenerPaseListaUseCase {
    constructor(private readonly repository: IAsistenciaEstudianteRepository) {}

    async execute(fecha: string, id_grupo: number, id_asignatura: number): Promise<PaseListaDto[]> {
        return await this.repository.getPaseListaByFechaGrupoAsignatura(fecha, id_grupo, id_asignatura);
    }
}