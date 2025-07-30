import { Repository } from 'typeorm';
import { AppDataSource } from '../../../../shared/infrastructure/config/databases';
import { ICalificacionRepository } from '../../../domain/repositories/ICalificacionRepository';
import { Calificacion } from '../../../domain/entities/Calificacion';
import { CalificacionEntity } from '../entities/CalificacionEntity';

export class CalificacionRepository implements ICalificacionRepository {
    private repository: Repository<CalificacionEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(CalificacionEntity);
    }

    async findAll(): Promise<Calificacion[]> {
        const entities = await this.repository.find();
        return entities.map(entity => this.toModel(entity));
    }

    async findById(id: number): Promise<Calificacion | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? this.toModel(entity) : null;
    }

    async create(calificacion: Omit<Calificacion, 'id'>): Promise<Calificacion> {
        const entity = this.repository.create(calificacion);
        const savedEntity = await this.repository.save(entity);
        return this.toModel(savedEntity);
    }

    async update(id: number, calificacion: Partial<Calificacion>): Promise<Calificacion | null> {
        await this.repository.update(id, calificacion);
        const updatedEntity = await this.repository.findOne({ where: { id } });
        return updatedEntity ? this.toModel(updatedEntity) : null;
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.repository.delete(id);
        return result.affected ? result.affected > 0 : false;
    }

    private toModel(entity: CalificacionEntity): Calificacion {
        return new Calificacion(
            entity.id,
            entity.estudiante_id,
            entity.actividad_id,
            entity.nota,
            entity.fecha_registro
        );
    }
}