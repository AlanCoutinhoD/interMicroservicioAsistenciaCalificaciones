import { Repository } from 'typeorm';
import { CursosDataSource } from '../../../../shared/infrastructure/config/databases';
import { AlumnoCursoGrupo } from '../../../domain/entities/AlumnoCursoGrupo';
import { IAlumnoCursoGrupoRepository } from '../../../application/ports/output/IAlumnoCursoGrupoRepository';
import { AlumnoCursoGrupoEntity } from '../entities/AlumnoCursoGrupoEntity';

export class AlumnoCursoGrupoRepository implements IAlumnoCursoGrupoRepository {
    private repository: Repository<AlumnoCursoGrupoEntity>;

    constructor() {
        this.repository = CursosDataSource.getRepository(AlumnoCursoGrupoEntity);
    }

    async findByGrupoYAsignatura(id_grupo: number, id_asignatura: number): Promise<AlumnoCursoGrupo[]> {
        const entities = await this.repository.find({
            where: {
                id_grupo,
                id_asignatura
            }
        });
        return entities.map(entity => this.mapToAlumnoCursoGrupo(entity));
    }

    private mapToAlumnoCursoGrupo(entity: AlumnoCursoGrupoEntity): AlumnoCursoGrupo {
        return new AlumnoCursoGrupo(
            entity.id_alumno_curso_grupo,
            entity.id_estudiante,
            entity.id_grupo,
            entity.id_asignatura
        );
    }
}