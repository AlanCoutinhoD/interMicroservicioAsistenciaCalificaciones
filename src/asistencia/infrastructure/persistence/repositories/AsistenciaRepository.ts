import { Repository } from 'typeorm';
import { AppDataSource } from '../../../../shared/infrastructure/config/database';
import { IAsistenciaRepository } from '../../../application/ports/output/IAsistenciaRepository';
import { Asistencia } from '../../../domain/entities/Asistencia';
import { AsistenciaEntity } from '../entities/AsistenciaEntity';

export class AsistenciaRepository implements IAsistenciaRepository {
  private repository: Repository<AsistenciaEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(AsistenciaEntity);
  }

  async findAll(): Promise<Asistencia[]> {
    const entities = await this.repository.find();
    return entities.map(this.toModel);
  }

  async findById(id: number): Promise<Asistencia | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toModel(entity) : null;
  }

  async create(asistencia: Omit<Asistencia, 'id'>): Promise<Asistencia> {
    const entity = this.repository.create(asistencia as AsistenciaEntity);
    const savedEntity = await this.repository.save(entity);
    return this.toModel(savedEntity);
  }

  async update(id: number, asistencia: Partial<Asistencia>): Promise<Asistencia | null> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) return null;

    Object.assign(entity, asistencia);
    const updatedEntity = await this.repository.save(entity);
    return this.toModel(updatedEntity);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  private toModel(entity: AsistenciaEntity): Asistencia {
    return new Asistencia(
      entity.id,
      entity.estudiante_id,
      entity.curso_id,
      entity.fecha,
      entity.estado,
      entity.registrado_por_usuario_id
    );
  }
}