import { Router } from 'express';
import { EstudiantesCursoController } from '../controllers/EstudiantesCursoController';

const router = Router();
const controller = new EstudiantesCursoController();

router.get('/estudiantes', controller.getEstudiantesPorGrupoYAsignatura.bind(controller));

export default router;