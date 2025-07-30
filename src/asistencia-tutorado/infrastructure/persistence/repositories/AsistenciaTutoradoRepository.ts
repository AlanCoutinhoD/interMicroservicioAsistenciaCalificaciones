import { Repository } from 'typeorm';
import { AppDataSource } from '../../../../shared/infrastructure/config/databases';
import { AsistenciaTutorado } from '../../../domain/entities/AsistenciaTutorado';
import { IAsistenciaTutoradoRepository } from '../../../application/ports/output/IAsistenciaTutoradoRepository';
import { AsistenciaTutoradoEntity } from '../entities/AsistenciaTutoradoEntity';

export class AsistenciaTutoradoRepository implements IAsistenciaTutoradoRepository {
    private repository: Repository<AsistenciaTutoradoEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(AsistenciaTutoradoEntity);
    }

    async save(asistencia: AsistenciaTutorado): Promise<AsistenciaTutorado> {
        const entity = new AsistenciaTutoradoEntity({
            tutor_id: asistencia.tutor_id,
            fecha: asistencia.fecha,
            estado: asistencia.estado
        });
        const savedEntity = await this.repository.save(entity);
        return this.mapToAsistencia(savedEntity);
    }

    async findAll(): Promise<AsistenciaTutorado[]> {
        const entities = await this.repository.find();
        return entities.map(entity => this.mapToAsistencia(entity));
    }

    async findById(id: number): Promise<AsistenciaTutorado | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? this.mapToAsistencia(entity) : null;
    }

    async update(id: number, asistencia: AsistenciaTutorado): Promise<AsistenciaTutorado | null> {
        const entity = await this.repository.findOne({ where: { id } });
        if (!entity) return null;

        entity.tutor_id = asistencia.tutor_id;
        entity.fecha = asistencia.fecha;
        entity.estado = asistencia.estado;

        const updatedEntity = await this.repository.save(entity);
        return this.mapToAsistencia(updatedEntity);
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.repository.delete(id);
        return result.affected ? result.affected > 0 : false;
    }

    private mapToAsistencia(entity: AsistenciaTutoradoEntity): AsistenciaTutorado {
        return new AsistenciaTutorado(
            entity.id,
            entity.tutor_id,
            entity.fecha,
            entity.estado
        );
    }
}