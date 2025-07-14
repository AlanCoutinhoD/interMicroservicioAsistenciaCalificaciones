import { AsistenciaTutorado } from '../../../domain/entities/AsistenciaTutorado';

export interface IAsistenciaTutoradoRepository {
    save(asistencia: AsistenciaTutorado): Promise<AsistenciaTutorado>;
    findAll(): Promise<AsistenciaTutorado[]>;
    findById(id: number): Promise<AsistenciaTutorado | null>;
    update(id: number, asistencia: AsistenciaTutorado): Promise<AsistenciaTutorado | null>;
    delete(id: number): Promise<boolean>;
}