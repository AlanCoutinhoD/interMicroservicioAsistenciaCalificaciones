"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAsistenciaUseCase = void 0;
class CreateAsistenciaUseCase {
    constructor(asistenciaRepository) {
        this.asistenciaRepository = asistenciaRepository;
    }
    async execute(asistencia) {
        return this.asistenciaRepository.create(asistencia);
    }
}
exports.CreateAsistenciaUseCase = CreateAsistenciaUseCase;
