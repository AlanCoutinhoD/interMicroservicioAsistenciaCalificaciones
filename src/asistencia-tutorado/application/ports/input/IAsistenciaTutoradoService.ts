import { AsistenciaTutorado } from '../../../domain/entities/AsistenciaTutorado';

export interface IAsistenciaTutoradoService {
    createAsistencia(asistencia: AsistenciaTutorado): Promise<AsistenciaTutorado>;
    getAllAsistencias(): Promise<AsistenciaTutorado[]>;
    getAsistenciaById(id: number): Promise<AsistenciaTutorado | null>;
    updateAsistencia(id: number, asistencia: AsistenciaTutorado): Promise<AsistenciaTutorado | null>;
    deleteAsistencia(id: number): Promise<boolean>;
}