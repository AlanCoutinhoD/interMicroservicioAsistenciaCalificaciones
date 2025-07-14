import { AsistenciaTutorado } from '../../domain/entities/AsistenciaTutorado';
import { IAsistenciaTutoradoRepository } from '../ports/output/IAsistenciaTutoradoRepository';

export class CreateAsistenciaTutoradoUseCase {
    constructor(private readonly asistenciaRepository: IAsistenciaTutoradoRepository) {}

    async execute(asistencia: AsistenciaTutorado): Promise<AsistenciaTutorado> {
        return await this.asistenciaRepository.save(asistencia);
    }
}