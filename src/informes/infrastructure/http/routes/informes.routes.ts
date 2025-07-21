import { Router } from 'express';
import { InformesController } from '../controllers/InformesController';

const router = Router();
const controller = new InformesController();

/**
 * @route POST /api/informes/asistencia
 * @description Genera un informe de asistencia usando Gemini AI
 * @body {
 *   tutorId: string,
 *   periodo?: string,
 *   formato?: 'detallado' | 'resumido' | 'ejecutivo',
 *   incluirGraficos?: boolean,
 *   incluirRecomendaciones?: boolean
 * }
 */
router.post('/asistencia', (req, res) => controller.generarInformeAsistencia(req, res));

/**
 * @route POST /api/informes/calificaciones
 * @description Genera un informe de calificaciones usando Gemini AI
 * @body {
 *   estudianteId?: string,
 *   tutorId?: string,
 *   periodo?: string,
 *   formato?: 'detallado' | 'resumido' | 'ejecutivo',
 *   incluirGraficos?: boolean,
 *   incluirRecomendaciones?: boolean
 * }
 */
router.post('/calificaciones', (req, res) => controller.generarInformeCalificaciones(req, res));

/**
 * @route POST /api/informes/integral
 * @description Genera un informe integral (asistencia + calificaciones) usando Gemini AI
 * @body {
 *   tutorId?: string,
 *   estudianteId?: string,
 *   periodo?: string,
 *   formato?: 'detallado' | 'resumido' | 'ejecutivo',
 *   incluirGraficos?: boolean,
 *   incluirRecomendaciones?: boolean
 * }
 */
router.post('/integral', (req, res) => controller.generarInformeIntegral(req, res));

/**
 * @route GET /api/informes/service-info
 * @description Obtiene información del servicio de IA configurado
 */
router.get('/service-info', (req, res) => controller.getServiceInfo(req, res));

/**
 * @route POST /api/informes/test
 * @description Endpoint de prueba para verificar la conexión con Gemini AI
 */
router.post('/test', async (req, res) => {
    try {
        const controller = new InformesController();
        
        // Datos de prueba simples
        const datosTest = {
            tutorId: "TutorPrueba",
            periodo: "2025-1",
            formato: "resumido",
            incluirRecomendaciones: true
        };

        // Simular request con datos de prueba
        const testReq = {
            body: datosTest
        } as any;

        const testRes = {
            json: (data: any) => res.json(data),
            status: (code: number) => ({
                json: (data: any) => res.status(code).json(data)
            })
        } as any;

        await controller.generarInformeAsistencia(testReq, testRes);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error en endpoint de prueba',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
});

export { router as informesRoutes };
