import { EstadoAsistenciaTutorado } from '../enums/EstadoAsistenciaTutorado';

export class AsistenciaTutorado {
    constructor(
        public id: number,
        public tutor_id: number,
        public fecha: Date,
        public estado: EstadoAsistenciaTutorado
    ) {}
}