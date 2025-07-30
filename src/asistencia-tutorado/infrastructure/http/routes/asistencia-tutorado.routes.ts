import { Router } from 'express';
import { AsistenciaTutoradoController } from '../controllers/AsistenciaTutoradoController';

const router = Router();
const controller = new AsistenciaTutoradoController();

router.post('/', controller.create.bind(controller));
router.get('/', controller.getAll.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.put('/:id', controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));

// Nueva ruta para obtener tutorados por tutor académico
router.get('/tutor/:tutorId/tutorados', controller.getTutoradosByTutor.bind(controller));

// Ruta de prueba para obtener todos los estudiantes activos
router.get('/estudiantes/activos', controller.getAllActiveStudents.bind(controller));

// === NUEVAS RUTAS PARA PASAR LISTA ===

// Obtener lista de asistencia del día (con estudiantes y sus estados)
router.get('/tutor/:tutorId/lista-asistencia', controller.obtenerListaAsistencia.bind(controller));

// Pasar lista (marcar asistencias múltiples)
router.post('/tutor/:tutorId/pasar-lista', controller.pasarLista.bind(controller));

// Obtener historial de asistencias
router.get('/tutor/:tutorId/historial', controller.obtenerHistorial.bind(controller));

// === RUTA PARA DATOS DE PRUEBA ===
// Crear datos de prueba para demostración
router.post('/datos-prueba', controller.crearDatosPrueba.bind(controller));

// Crear estudiantes de prueba en la base de datos de alumnos
router.post('/estudiantes-prueba', controller.crearDatosAlumnosPrueba.bind(controller));

export default router;