import { Router } from 'express';
import { CalificacionController } from '../controllers/CalificacionController';

const router = Router();
const controller = new CalificacionController();

router.get('/calificaciones', controller.getAll.bind(controller));
router.get('/calificaciones/:id', controller.getById.bind(controller));
router.post('/calificaciones', controller.create.bind(controller));
router.put('/calificaciones/:id', controller.update.bind(controller));
router.delete('/calificaciones/:id', controller.delete.bind(controller));

export default router;