import { Calificacion } from '../../domain/entities/Calificacion';
import { ICalificacionRepository } from '../../domain/repositories/ICalificacionRepository';

export class CreateCalificacionUseCase {
    constructor(private calificacionRepository: ICalificacionRepository) {}

    async execute(data: {
        estudiante_id: number;
        actividad_id: number;
        nota: number;
        fecha_registro?: Date;
    }): Promise<Calificacion> {
        const calificacion = await this.calificacionRepository.create({
            ...data,
            fecha_registro: data.fecha_registro || new Date()
        });
        return calificacion;
    }
}