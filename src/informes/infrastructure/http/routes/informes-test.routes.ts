import { Router } from 'express';
import { InformesSimpleController } from '../controllers/InformesSimpleController';

const router = Router();
const controller = new InformesSimpleController();

/**
 * @route GET /api/informes/health
 * @description Health check simple para verificar que las rutas funcionan
 */
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Rutas de informes funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

/**
 * @route GET /api/informes/test-simple
 * @description Test simple sin dependencias
 */
router.get('/test-simple', (req, res) => {
    res.json({
        success: true,
        message: 'Test simple exitoso',
        gemini_configured: !!process.env.GEMINI_API_KEY,
        timestamp: new Date().toISOString()
    });
});

/**
 * @route POST /api/informes/test-gemini
 * @description Test de Gemini AI con datos de prueba
 */
router.post('/test-gemini', (req, res) => controller.testGemini(req, res));

/**
 * @route GET /api/informes/service-info
 * @description Información del servicio Gemini AI
 */
router.get('/service-info', (req, res) => controller.getServiceInfo(req, res));

export { router as informesTestRoutes };
