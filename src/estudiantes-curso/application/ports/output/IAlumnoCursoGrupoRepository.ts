import { AlumnoCursoGrupo } from '../../../domain/entities/AlumnoCursoGrupo';

export interface IAlumnoCursoGrupoRepository {
    findByGrupoYAsignatura(id_grupo: number, id_asignatura: number): Promise<AlumnoCursoGrupo[]>;
}