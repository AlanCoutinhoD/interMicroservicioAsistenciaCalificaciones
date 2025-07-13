import { Router } from 'express';
import { AsistenciaController } from '../controllers/AsistenciaController';

const router = Router();
const controller = new AsistenciaController();

router.get('/asistencias', controller.getAll.bind(controller));
router.get('/asistencias/:id', controller.getById.bind(controller));
router.post('/asistencias', controller.create.bind(controller));
router.put('/asistencias/:id', controller.update.bind(controller));
router.delete('/asistencias/:id', controller.delete.bind(controller));

export default router;