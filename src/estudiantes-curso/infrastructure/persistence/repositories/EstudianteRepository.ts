import { Repository, In } from 'typeorm';
import { AlumnosDataSource } from '../../../../shared/infrastructure/config/databases';
import { Estudiante } from '../../../domain/entities/Estudiante';
import { IEstudianteRepository } from '../../../application/ports/output/IEstudianteRepository';
import { EstudianteEntity } from '../entities/EstudianteEntity';

export class EstudianteRepository implements IEstudianteRepository {
    private repository: Repository<EstudianteEntity>;

    constructor() {
        this.repository = AlumnosDataSource.getRepository(EstudianteEntity);
    }

    async findByIds(ids: number[]): Promise<Estudiante[]> {
        const entities = await this.repository.find({
            where: {
                id: In(ids)
            },
            select: ['id', 'matricula', 'nombre', 'email']
        });
        return entities.map(entity => this.mapToEstudiante(entity));
    }

    private mapToEstudiante(entity: EstudianteEntity): Estudiante {
        return new Estudiante(
            entity.id,
            entity.matricula,
            entity.nombre,
            entity.email
        );
    }
}