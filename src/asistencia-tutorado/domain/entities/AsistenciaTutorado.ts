import { EstadoAsistenciaTutorado } from '../enums/EstadoAsistenciaTutorado';

export class AsistenciaTutorado {
    constructor(
        public id: number,
        public tutorAcademico: string,
        public matriculaEstudiante: string,
        public nombreEstudiante: string,
        public carreraEstudiante: string | undefined,
        public fecha: Date,
        public estado: EstadoAsistenciaTutorado,
        public observaciones?: string,
        public createdAt?: Date
    ) {}

    get estaPresente(): boolean {
        return this.estado === EstadoAsistenciaTutorado.PRESENTE;
    }

    get estaJustificado(): boolean {
        return this.estado === EstadoAsistenciaTutorado.JUSTIFICADO;
    }
}