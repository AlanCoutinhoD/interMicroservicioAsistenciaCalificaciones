import { Request, Response } from 'express';
import { GeminiAIService, InformeRequest } from '../../../../shared/infrastructure/services/GeminiAIService';
import { AsistenciaTutoradoRepository } from '../../../../asistencia-tutorado/infrastructure/persistence/repositories/AsistenciaTutoradoRepository';
import { CalificacionRepository } from '../../../../calificacion/infrastructure/persistence/repositories/CalificacionRepository';
import { AlumnoRepository } from '../../../../shared/infrastructure/persistence/repositories/AlumnoRepository';

export class InformesController {
    private geminiService: GeminiAIService;
    private asistenciaRepository: AsistenciaTutoradoRepository;
    private calificacionRepository: CalificacionRepository;
    private alumnoRepository: AlumnoRepository;

    constructor() {
        this.geminiService = new GeminiAIService();
        this.asistenciaRepository = new AsistenciaTutoradoRepository();
        this.calificacionRepository = new CalificacionRepository();
        this.alumnoRepository = new AlumnoRepository();
    }

    /**
     * Genera informe de asistencia usando Gemini AI
     */
    async generarInformeAsistencia(req: Request, res: Response): Promise<void> {
        try {
            const { tutorId, periodo, formato } = req.body;

            if (!tutorId) {
                res.status(400).json({
                    success: false,
                    message: 'tutorId es requerido'
                });
                return;
            }

            // Obtener datos de asistencia
            const datosAsistencia = await this.obtenerDatosAsistencia(tutorId, periodo);

            if (datosAsistencia.length === 0) {
                res.status(404).json({
                    success: false,
                    message: 'No se encontraron datos de asistencia para el periodo especificado'
                });
                return;
            }

            // Preparar request para Gemini
            const informeRequest: InformeRequest = {
                tipo: 'asistencia',
                datos: {
                    tutor_academico: tutorId,
                    periodo: periodo,
                    total_registros: datosAsistencia.length,
                    registros_asistencia: datosAsistencia,
                    estadisticas: this.calcularEstadisticasAsistencia(datosAsistencia)
                },
                parametros: {
                    periodo,
                    formato: formato || 'detallado',
                    incluirGraficos: req.body.incluirGraficos || false,
                    incluirRecomendaciones: req.body.incluirRecomendaciones !== false
                }
            };

            // Generar informe con Gemini
            const resultado = await this.geminiService.generarInforme(informeRequest);

            if (resultado.success) {
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
                res.status(500).json({
                    success: false,
                    message: 'Error al generar informe con IA',
                    error: resultado.error
                });
            }

        } catch (error) {
            console.error('Error en generarInformeAsistencia:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }

    /**
     * Genera informe de calificaciones usando Gemini AI
     */
    async generarInformeCalificaciones(req: Request, res: Response): Promise<void> {
        try {
            const { estudianteId, tutorId, periodo, formato } = req.body;

            if (!estudianteId && !tutorId) {
                res.status(400).json({
                    success: false,
                    message: 'estudianteId o tutorId es requerido'
                });
                return;
            }

            // Obtener datos de calificaciones
            const datosCalificaciones = await this.obtenerDatosCalificaciones(estudianteId, tutorId, periodo);

            if (datosCalificaciones.length === 0) {
                res.status(404).json({
                    success: false,
                    message: 'No se encontraron datos de calificaciones para los parámetros especificados'
                });
                return;
            }

            // Preparar request para Gemini
            const informeRequest: InformeRequest = {
                tipo: 'calificaciones',
                datos: {
                    estudiante_id: estudianteId,
                    tutor_academico: tutorId,
                    periodo: periodo,
                    total_calificaciones: datosCalificaciones.length,
                    calificaciones: datosCalificaciones,
                    estadisticas: this.calcularEstadisticasCalificaciones(datosCalificaciones)
                },
                parametros: {
                    periodo,
                    formato: formato || 'detallado',
                    incluirGraficos: req.body.incluirGraficos || false,
                    incluirRecomendaciones: req.body.incluirRecomendaciones !== false
                }
            };

            // Generar informe con Gemini
            const resultado = await this.geminiService.generarInforme(informeRequest);

            if (resultado.success) {
                try {
                    const informeParseado = JSON.parse(resultado.data || '{}');
                    
                    res.json({
                        success: true,
                        tipo_informe: 'calificaciones',
                        informe: informeParseado,
                        metadata: resultado.metadata
                    });
                } catch {
                    res.json({
                        success: true,
                        tipo_informe: 'calificaciones',
                        informe_texto: resultado.data,
                        metadata: resultado.metadata
                    });
                }
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Error al generar informe con IA',
                    error: resultado.error
                });
            }

        } catch (error) {
            console.error('Error en generarInformeCalificaciones:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }

    /**
     * Genera informe integral (asistencia + calificaciones)
     */
    async generarInformeIntegral(req: Request, res: Response): Promise<void> {
        try {
            const { tutorId, estudianteId, periodo, formato } = req.body;

            if (!tutorId && !estudianteId) {
                res.status(400).json({
                    success: false,
                    message: 'tutorId o estudianteId es requerido'
                });
                return;
            }

            // Obtener datos combinados
            const datosAsistencia = await this.obtenerDatosAsistencia(tutorId, periodo);
            const datosCalificaciones = await this.obtenerDatosCalificaciones(estudianteId, tutorId, periodo);

            if (datosAsistencia.length === 0 && datosCalificaciones.length === 0) {
                res.status(404).json({
                    success: false,
                    message: 'No se encontraron datos para generar informe integral'
                });
                return;
            }

            // Preparar request para Gemini
            const informeRequest: InformeRequest = {
                tipo: 'general',
                datos: {
                    tutor_academico: tutorId,
                    estudiante_id: estudianteId,
                    periodo: periodo,
                    asistencia: {
                        total_registros: datosAsistencia.length,
                        registros: datosAsistencia,
                        estadisticas: this.calcularEstadisticasAsistencia(datosAsistencia)
                    },
                    calificaciones: {
                        total_registros: datosCalificaciones.length,
                        registros: datosCalificaciones,
                        estadisticas: this.calcularEstadisticasCalificaciones(datosCalificaciones)
                    }
                },
                parametros: {
                    periodo,
                    formato: formato || 'detallado',
                    incluirGraficos: req.body.incluirGraficos || false,
                    incluirRecomendaciones: req.body.incluirRecomendaciones !== false
                }
            };

            // Generar informe con Gemini
            const resultado = await this.geminiService.generarInforme(informeRequest);

            if (resultado.success) {
                try {
                    const informeParseado = JSON.parse(resultado.data || '{}');
                    
                    res.json({
                        success: true,
                        tipo_informe: 'integral',
                        informe: informeParseado,
                        metadata: resultado.metadata
                    });
                } catch {
                    res.json({
                        success: true,
                        tipo_informe: 'integral',
                        informe_texto: resultado.data,
                        metadata: resultado.metadata
                    });
                }
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Error al generar informe con IA',
                    error: resultado.error
                });
            }

        } catch (error) {
            console.error('Error en generarInformeIntegral:', error);
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

    // Métodos auxiliares privados

    private async obtenerDatosAsistencia(tutorId?: string, periodo?: string): Promise<any[]> {
        try {
            if (tutorId) {
                const historial = await this.asistenciaRepository.getHistorialByTutor(tutorId, 100);
                return historial.map(h => ({
                    id: h.id,
                    matricula: h.matriculaEstudiante,
                    nombre: h.nombreEstudiante,
                    carrera: h.carreraEstudiante,
                    fecha: h.fecha,
                    estado: h.estado,
                    observaciones: h.observaciones,
                    tutor_academico: h.tutorAcademico
                }));
            }
            
            return await this.asistenciaRepository.findAll();
        } catch (error) {
            console.error('Error al obtener datos de asistencia:', error);
            return [];
        }
    }

    private async obtenerDatosCalificaciones(estudianteId?: string, tutorId?: string, periodo?: string): Promise<any[]> {
        try {
            // Por ahora obtener todas las calificaciones ya que no existe método específico
            const todasCalificaciones = await this.calificacionRepository.findAll();
            
            // Filtrar por estudiante si se proporciona
            if (estudianteId) {
                return todasCalificaciones.filter(c => c.estudiante_id.toString() === estudianteId);
            }
            
            return todasCalificaciones;
        } catch (error) {
            console.error('Error al obtener datos de calificaciones:', error);
            return [];
        }
    }

    private calcularEstadisticasAsistencia(datos: any[]): object {
        if (datos.length === 0) return {};

        const total = datos.length;
        const presentes = datos.filter(d => d.estado === 'PRESENTE').length;
        const retardos = datos.filter(d => d.estado === 'RETARDO').length;
        const ausentes = datos.filter(d => d.estado === 'AUSENTE').length;
        const justificados = datos.filter(d => d.estado === 'JUSTIFICADO').length;

        return {
            total_registros: total,
            presentes: {
                cantidad: presentes,
                porcentaje: ((presentes / total) * 100).toFixed(2)
            },
            retardos: {
                cantidad: retardos,
                porcentaje: ((retardos / total) * 100).toFixed(2)
            },
            ausentes: {
                cantidad: ausentes,
                porcentaje: ((ausentes / total) * 100).toFixed(2)
            },
            justificados: {
                cantidad: justificados,
                porcentaje: ((justificados / total) * 100).toFixed(2)
            },
            asistencia_efectiva: {
                cantidad: presentes + retardos,
                porcentaje: (((presentes + retardos) / total) * 100).toFixed(2)
            }
        };
    }

    private calcularEstadisticasCalificaciones(datos: any[]): object {
        if (datos.length === 0) return {};

        const calificaciones = datos.map(d => parseFloat(d.nota) || 0);
        const suma = calificaciones.reduce((a, b) => a + b, 0);
        const promedio = suma / calificaciones.length;
        
        const calificacionesOrdenadas = [...calificaciones].sort((a, b) => a - b);
        const mediana = calificacionesOrdenadas.length % 2 === 0
            ? (calificacionesOrdenadas[calificacionesOrdenadas.length / 2 - 1] + calificacionesOrdenadas[calificacionesOrdenadas.length / 2]) / 2
            : calificacionesOrdenadas[Math.floor(calificacionesOrdenadas.length / 2)];

        const aprobados = calificaciones.filter(c => c >= 6).length;
        const reprobados = calificaciones.filter(c => c < 6).length;

        return {
            total_calificaciones: datos.length,
            promedio: promedio.toFixed(2),
            mediana: mediana.toFixed(2),
            calificacion_maxima: Math.max(...calificaciones).toFixed(2),
            calificacion_minima: Math.min(...calificaciones).toFixed(2),
            aprobados: {
                cantidad: aprobados,
                porcentaje: ((aprobados / datos.length) * 100).toFixed(2)
            },
            reprobados: {
                cantidad: reprobados,
                porcentaje: ((reprobados / datos.length) * 100).toFixed(2)
            }
        };
    }
}
