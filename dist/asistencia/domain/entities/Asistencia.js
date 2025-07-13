"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asistencia = void 0;
class Asistencia {
    constructor(id, estudiante_id, curso_id, fecha, estado, registrado_por_usuario_id) {
        this.id = id;
        this.estudiante_id = estudiante_id;
        this.curso_id = curso_id;
        this.fecha = fecha;
        this.estado = estado;
        this.registrado_por_usuario_id = registrado_por_usuario_id;
    }
}
exports.Asistencia = Asistencia;
