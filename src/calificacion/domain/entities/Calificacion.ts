export class Calificacion {
    constructor(
        public id: number,
        public estudiante_id: number,
        public actividad_id: number,
        public nota: number,
        public fecha_registro: Date
    ) {}
}