import { Request, Response } from 'express';
import { GeminiAIService, InformeRequest } from '../../../../shared/infrastructure/services/GeminiAIService';

export class InformesSimpleController {
    private geminiService: GeminiAIService;

    constructor() {
        this.geminiService = new GeminiAIService();
    }

    /**
     * Test simple de Gemini AI sin dependencias complejas
     */
    async testGemini(req: Request, res: Response): Promise<void> {
        try {
            console.log('🤖 Iniciando test de Gemini AI...');
            
            // Datos de prueba simples
            const datosTest = {
                tutor_academico: 'TutorEjemplo',
                periodo: '2025-1',
                total_registros: 3,
                registros_asistencia: [
                    {
                        id: 1,
                        matricula: '123456',
                        nombre: 'Juan Pérez García',
                        carrera: 'Informática',
                        fecha: '2025-01-19',
                        estado: 'PRESENTE',
                        observaciones: 'Asistencia puntual'
                    },
                    {
                        id: 2,
                        matricula: '789012',
                        nombre: 'María García López',
                        carrera: 'Informática',
                        fecha: '2025-01-19',
                        estado: 'RETARDO',
                        observaciones: 'Llegó 15 minutos tarde'
                    },
                    {
                        id: 3,
                        matricula: '345678',
                        nombre: 'Pedro López Silva',
                        carrera: 'Informática',
                        fecha: '2025-01-19',
                        estado: 'AUSENTE',
                        observaciones: 'No se presentó'
                    }
                ],
                estadisticas: {
                    total_registros: 3,
                    presentes: { cantidad: 1, porcentaje: '33.33' },
                    retardos: { cantidad: 1, porcentaje: '33.33' },
                    ausentes: { cantidad: 1, porcentaje: '33.33' },
                    asistencia_efectiva: { cantidad: 2, porcentaje: '66.67' }
                }
            };

            // Preparar request para Gemini
            const informeRequest: InformeRequest = {
                tipo: 'asistencia',
                datos: datosTest,
                parametros: {
                    periodo: '2025-1',
                    formato: 'resumido',
                    incluirGraficos: false,
                    incluirRecomendaciones: true
                }
            };

            console.log('📊 Datos preparados para Gemini:', JSON.stringify(datosTest, null, 2));

            // Generar informe con Gemini
            const resultado = await this.geminiService.generarInforme(informeRequest);

            if (resultado.success) {
                console.log('✅ Gemini respondió exitosamente');
                
                // Intentar parsear la respuesta JSON
                try {
                    const informeParseado = JSON.parse(resultado.data || '{}');
                    
                    res.json({
                        success: true,
                        tipo_informe: 'asistencia',
                        informe: informeParseado,
                        metadata: resultado.metadata
                    });
                } catch {
                    // Si no es JSON válido, devolver como texto
                    res.json({
                        success: true,
                        tipo_informe: 'asistencia',
                        informe_texto: resultado.data,
                        metadata: resultado.metadata
                    });
                }
            } else {
                console.log('❌ Error en Gemini:', resultado.error);
                res.status(500).json({
                    success: false,
                    message: 'Error al generar informe con IA',
                    error: resultado.error
                });
            }

        } catch (error) {
            console.error('❌ Error en testGemini:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }

    /**
     * Obtiene información del servicio de IA
     */
    async getServiceInfo(_req: Request, res: Response): Promise<void> {
        try {
            const info = this.geminiService.getModelInfo();
            res.json({
                success: true,
                service_info: info
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener información del servicio',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
}
