import { Request, Response } from 'express';
import { CreateAsistenciaTutoradoUseCase } from '../../../application/usecases/CreateAsistenciaTutoradoUseCase';
import { PasarListaTutoradoUseCase } from '../../../application/usecases/PasarListaTutoradoUseCase';
import { ObtenerListaAsistenciaUseCase } from '../../../application/usecases/ObtenerListaAsistenciaUseCase';
import { AsistenciaTutoradoRepository } from '../../persistence/repositories/AsistenciaTutoradoRepository';
import { AsistenciaTutorado } from '../../../domain/entities/AsistenciaTutorado';
import { AlumnoRepository } from '../../../../shared/infrastructure/persistence/repositories/AlumnoRepository';
import { EstadoAsistenciaTutorado } from '../../../domain/enums/EstadoAsistenciaTutorado';
import { AlumnosDataSource } from '../../../../shared/infrastructure/config/alumnosDatabase';

export class AsistenciaTutoradoController {
    private createUseCase: CreateAsistenciaTutoradoUseCase;
    private pasarListaUseCase: PasarListaTutoradoUseCase;
    private obtenerListaUseCase: ObtenerListaAsistenciaUseCase;
    private repository: AsistenciaTutoradoRepository;
    private alumnoRepository: AlumnoRepository;

    constructor() {
        this.repository = new AsistenciaTutoradoRepository();
        this.alumnoRepository = new AlumnoRepository();
        this.createUseCase = new CreateAsistenciaTutoradoUseCase(this.repository);
        this.pasarListaUseCase = new PasarListaTutoradoUseCase(this.repository, this.alumnoRepository);
        this.obtenerListaUseCase = new ObtenerListaAsistenciaUseCase(this.repository, this.alumnoRepository);
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const asistencia = new AsistenciaTutorado(
                0,
                req.body.tutor_academico,
                req.body.matricula_estudiante,
                req.body.nombre_estudiante,
                req.body.carrera_estudiante,
                new Date(req.body.fecha),
                req.body.estado,
                req.body.observaciones
            );
            const result = await this.createUseCase.execute(asistencia);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error al crear la asistencia del tutorado' });
        }
    }

    async getAll(_req: Request, res: Response): Promise<void> {
        try {
            const asistencias = await this.repository.findAll();
            res.json(asistencias);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener las asistencias' });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const asistencia = await this.repository.findById(id);
            if (asistencia) {
                res.json(asistencia);
            } else {
                res.status(404).json({ message: 'Asistencia no encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener la asistencia' });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const asistencia = new AsistenciaTutorado(
                id,
                req.body.tutor_academico,
                req.body.matricula_estudiante,
                req.body.nombre_estudiante,
                req.body.carrera_estudiante,
                new Date(req.body.fecha),
                req.body.estado,
                req.body.observaciones
            );
            const updated = await this.repository.update(id, asistencia);
            if (updated) {
                res.json(updated);
            } else {
                res.status(404).json({ message: 'Asistencia no encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar la asistencia' });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const deleted = await this.repository.delete(id);
            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: 'Asistencia no encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar la asistencia' });
        }
    }

    // Método para obtener la lista de tutorados por tutor académico
    async getTutoradosByTutor(req: Request, res: Response): Promise<void> {
        try {
            const tutorId = req.params.tutorId;
            
            if (!tutorId) {
                res.status(400).json({ message: 'ID del tutor requerido' });
                return;
            }

            const tutorados = await this.alumnoRepository.findByTutorAcademico(tutorId);
            
            res.json({
                tutor_id: tutorId,
                total_tutorados: tutorados.length,
                tutorados: tutorados.map(alumno => ({
                    id: alumno.id,
                    matricula: alumno.matricula,
                    nombre: alumno.nombre,
                    carrera: alumno.carrera,
                    estatus: alumno.estatusAlumno,
                    cuatrimestre_actual: alumno.cuatrimestreActual,
                    grupo_actual: alumno.grupoActual,
                    materia: alumno.materia,
                    periodo: alumno.periodo
                }))
            });
        } catch (error) {
            console.error('Error al obtener tutorados:', error);
            res.status(500).json({ message: 'Error al obtener la lista de tutorados' });
        }
    }

    // Método de prueba para obtener todos los estudiantes activos
    async getAllActiveStudents(_req: Request, res: Response): Promise<void> {
        try {
            const estudiantes = await this.alumnoRepository.findAll();
            const estudiantesActivos = estudiantes.filter(est => est.estaActivo);
            
            res.json({
                total_estudiantes_activos: estudiantesActivos.length,
                estudiantes: estudiantesActivos.map(alumno => ({
                    id: alumno.id,
                    matricula: alumno.matricula,
                    nombre: alumno.nombre,
                    carrera: alumno.carrera,
                    tutor_academico: alumno.tutorAcademico,
                    cuatrimestre_actual: alumno.cuatrimestreActual,
                    grupo_actual: alumno.grupoActual
                }))
            });
        } catch (error) {
            console.error('Error al obtener estudiantes activos:', error);
            res.status(500).json({ message: 'Error al obtener la lista de estudiantes activos' });
        }
    }

    // Nuevo método para obtener la lista de asistencia del día
    async obtenerListaAsistencia(req: Request, res: Response): Promise<void> {
        try {
            const { tutorId } = req.params;
            const fecha = req.query.fecha ? new Date(req.query.fecha as string) : new Date();

            const lista = await this.obtenerListaUseCase.execute(tutorId, fecha);
            
            res.json(lista);
        } catch (error) {
            console.error('Error al obtener lista de asistencia:', error);
            res.status(500).json({ message: 'Error al obtener la lista de asistencia' });
        }
    }

    // Nuevo método para pasar lista (marcar asistencias)
    async pasarLista(req: Request, res: Response): Promise<void> {
        try {
            const { tutorId } = req.params;
            const { fecha, asistencias } = req.body;

            if (!asistencias || !Array.isArray(asistencias)) {
                res.status(400).json({ message: 'Las asistencias son requeridas y deben ser un array' });
                return;
            }

            const request = {
                tutorAcademico: tutorId,
                fecha: new Date(fecha || new Date()),
                asistencias: asistencias.map((a: any) => ({
                    matricula: a.matricula,
                    estado: a.estado as EstadoAsistenciaTutorado,
                    observaciones: a.observaciones
                }))
            };

            const resultados = await this.pasarListaUseCase.execute(request);
            
            res.json({
                message: 'Lista pasada exitosamente',
                total_registros: resultados.length,
                registros: resultados.map(r => ({
                    matricula: r.matriculaEstudiante,
                    nombre: r.nombreEstudiante,
                    estado: r.estado,
                    observaciones: r.observaciones
                }))
            });
        } catch (error) {
            console.error('Error al pasar lista:', error);
            res.status(500).json({ 
                message: error instanceof Error ? error.message : 'Error al pasar lista' 
            });
        }
    }

    // Método para obtener historial de asistencias
    async obtenerHistorial(req: Request, res: Response): Promise<void> {
        try {
            const { tutorId } = req.params;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

            const historial = await this.repository.getHistorialByTutor(tutorId, limit);
            
            res.json({
                tutor_academico: tutorId,
                total_registros: historial.length,
                historial: historial.map(h => ({
                    id: h.id,
                    matricula: h.matriculaEstudiante,
                    nombre: h.nombreEstudiante,
                    carrera: h.carreraEstudiante,
                    fecha: h.fecha,
                    estado: h.estado,
                    observaciones: h.observaciones,
                    created_at: h.createdAt
                }))
            });
        } catch (error) {
            console.error('Error al obtener historial:', error);
            res.status(500).json({ message: 'Error al obtener el historial de asistencias' });
        }
    }

    async crearDatosPrueba(_req: Request, res: Response): Promise<void> {
        try {
            console.log('=== CREANDO DATOS DE PRUEBA ===');
            
            // Crear algunas asistencias de prueba
            const asistencias = [
                new AsistenciaTutorado(
                    0, // id
                    'TutorEjemplo', // tutorAcademico
                    '123456', // matriculaEstudiante
                    'Juan Pérez García', // nombreEstudiante
                    'Informática', // carreraEstudiante
                    new Date('2025-01-14'), // fecha
                    EstadoAsistenciaTutorado.PRESENTE, // estado
                    'Asistencia puntual', // observaciones
                    new Date() // createdAt
                ),
                new AsistenciaTutorado(
                    0,
                    'TutorEjemplo',
                    '789012',
                    'María García López',
                    'Informática',
                    new Date('2025-01-14'),
                    EstadoAsistenciaTutorado.RETARDO,
                    'Llegó 15 minutos tarde',
                    new Date()
                ),
                new AsistenciaTutorado(
                    0,
                    'TutorEjemplo',
                    '345678',
                    'Pedro López Silva',
                    'Informática',
                    new Date('2025-01-14'),
                    EstadoAsistenciaTutorado.AUSENTE,
                    'No se presentó',
                    new Date()
                )
            ];

            const asistenciasGuardadas = [];
            for (const asistencia of asistencias) {
                const guardada = await this.repository.save(asistencia);
                asistenciasGuardadas.push(guardada);
                console.log(`Asistencia guardada: ${guardada.matriculaEstudiante} - ${guardada.estado}`);
            }

            res.status(201).json({
                mensaje: 'Datos de prueba creados exitosamente',
                asistencias: asistenciasGuardadas.length,
                detalle: asistenciasGuardadas
            });
        } catch (error) {
            console.error('Error al crear datos de prueba:', error);
            res.status(500).json({
                mensaje: 'Error al crear datos de prueba',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }

    async crearDatosAlumnosPrueba(_req: Request, res: Response): Promise<void> {
        try {
            console.log('=== CREANDO ESTUDIANTES DE PRUEBA ===');
            
            // Usar AlumnosDataSource para ejecutar INSERT directo
            const queryRunner = AlumnosDataSource.createQueryRunner();
            
            await queryRunner.connect();
            
            try {
                // Crear estudiantes de prueba para TutorEjemplo
                const estudiantesPrueba = [
                    {
                        matricula: '123456',
                        nombre: 'Juan Pérez García',
                        carrera: 'Informática',
                        estatus_alumno: 'Activo',
                        cuatrimestre_actual: 3,
                        grupo_actual: 'A',
                        materia: 'Matemáticas',
                        periodo: '2025-1',
                        tutor_academico: 'TutorEjemplo',
                        email: 'juan.perez@universidad.edu'
                    },
                    {
                        matricula: '789012',
                        nombre: 'María García López',
                        carrera: 'Informática',
                        estatus_alumno: 'Activo',
                        cuatrimestre_actual: 3,
                        grupo_actual: 'A',
                        materia: 'Matemáticas',
                        periodo: '2025-1',
                        tutor_academico: 'TutorEjemplo',
                        email: 'maria.garcia@universidad.edu'
                    },
                    {
                        matricula: '345678',
                        nombre: 'Pedro López Silva',
                        carrera: 'Informática',
                        estatus_alumno: 'Activo',
                        cuatrimestre_actual: 3,
                        grupo_actual: 'A',
                        materia: 'Matemáticas',
                        periodo: '2025-1',
                        tutor_academico: 'TutorEjemplo',
                        email: 'pedro.lopez@universidad.edu'
                    },
                    {
                        matricula: '456789',
                        nombre: 'Ana Martínez Hernández',
                        carrera: 'Informática',
                        estatus_alumno: 'Activo',
                        cuatrimestre_actual: 3,
                        grupo_actual: 'B',
                        materia: 'Física',
                        periodo: '2025-1',
                        tutor_academico: 'TutorEjemplo',
                        email: 'ana.martinez@universidad.edu'
                    }
                ];

                let estudiantesCreados = 0;
                
                for (const estudiante of estudiantesPrueba) {
                    try {
                        await queryRunner.query(`
                            INSERT INTO estudiantes (
                                matricula, nombre, carrera,
                                estatus_alumno, cuatrimestre_actual, grupo_actual, materia, periodo,
                                tutor_academico, email
                            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                            ON DUPLICATE KEY UPDATE
                                nombre = VALUES(nombre),
                                carrera = VALUES(carrera),
                                estatus_alumno = VALUES(estatus_alumno),
                                cuatrimestre_actual = VALUES(cuatrimestre_actual),
                                grupo_actual = VALUES(grupo_actual),
                                materia = VALUES(materia),
                                periodo = VALUES(periodo),
                                tutor_academico = VALUES(tutor_academico),
                                email = VALUES(email)
                        `, [
                            estudiante.matricula,
                            estudiante.nombre,
                            estudiante.carrera,
                            estudiante.estatus_alumno,
                            estudiante.cuatrimestre_actual,
                            estudiante.grupo_actual,
                            estudiante.materia,
                            estudiante.periodo,
                            estudiante.tutor_academico,
                            estudiante.email
                        ]);
                        
                        estudiantesCreados++;
                        console.log(`Estudiante creado/actualizado: ${estudiante.matricula} - ${estudiante.nombre}`);
                    } catch (error) {
                        console.error(`Error al crear estudiante ${estudiante.matricula}:`, error);
                    }
                }

                res.status(201).json({
                    mensaje: 'Estudiantes de prueba creados exitosamente',
                    estudiantes_procesados: estudiantesCreados,
                    total_intentos: estudiantesPrueba.length
                });
                
            } finally {
                await queryRunner.release();
            }
            
        } catch (error) {
            console.error('Error al crear estudiantes de prueba:', error);
            res.status(500).json({
                mensaje: 'Error al crear estudiantes de prueba',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
}