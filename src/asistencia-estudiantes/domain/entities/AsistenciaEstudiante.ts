export class AsistenciaEstudiante {
    constructor(
        public readonly id_asistencia: number,
        public readonly id_alumno: number,
        public readonly id_grupo: number,
        public readonly id_asignatura: number,
        public readonly estado: string,
        public readonly fecha?: Date
    ) {}
}