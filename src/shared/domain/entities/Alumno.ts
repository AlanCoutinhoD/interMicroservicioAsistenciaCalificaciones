export class Alumno {
    constructor(
        public id: number,
        public matricula: string,
        public nombre: string,
        public carrera: string,
        public estatusAlumno: string,
        public cuatrimestreActual: string,
        public grupoActual?: string,
        public materia?: string,
        public periodo?: string,
        public estatusMateria?: string,
        public final?: number,
        public extra?: string,
        public estatusCardex?: string,
        public periodoCursado?: string,
        public planEstudiosClave?: string,
        public creditos?: number,
        public tutorAcademico?: string, // Ahora es string
        public createdAt?: Date,
        public updatedAt?: Date
    ) {}

    get nombreCompleto(): string {
        return this.nombre;
    }

    get estaActivo(): boolean {
        return this.estatusAlumno === 'Activo';
    }
}
