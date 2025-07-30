import { Router } from 'express';
import { AsistenciaEstudianteController } from '../controllers/AsistenciaEstudianteController';

const router = Router();
const controller = new AsistenciaEstudianteController();

// POST /api/asistencia-estudiantes/registrar - Registrar múltiples asistencias
router.post('/registrar', controller.registrarAsistencias.bind(controller));

// GET /api/asistencia-estudiantes/pase-lista - Obtener pase de lista
router.get('/pase-lista', controller.obtenerPaseLista.bind(controller));

export { router as asistenciaEstudiantesRoutes };