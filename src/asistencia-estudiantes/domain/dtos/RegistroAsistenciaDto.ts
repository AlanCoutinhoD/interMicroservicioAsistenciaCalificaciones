export interface RegistroAsistenciaDto {
    id_alumno: number;
    estado: string;
}

export interface RegistroAsistenciasRequest {
    id_grupo: number;
    id_asignatura: number;
    fecha: string;
    asistencias: RegistroAsistenciaDto[];
}