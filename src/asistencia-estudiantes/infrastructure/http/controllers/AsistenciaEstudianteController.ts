import { Request, Response } from 'express';
import { RegistrarAsistenciasUseCase } from '../../../application/usecases/RegistrarAsistenciasUseCase';
import { ObtenerPaseListaUseCase } from '../../../application/usecases/ObtenerPaseListaUseCase';
import { AsistenciaEstudianteRepository } from '../../persistence/repositories/AsistenciaEstudianteRepository';
import { RegistroAsistenciasRequest } from '../../../domain/dtos/RegistroAsistenciaDto';

export class AsistenciaEstudianteController {
    private registrarAsistenciasUseCase: RegistrarAsistenciasUseCase;
    private obtenerPaseListaUseCase: ObtenerPaseListaUseCase;
    private repository: AsistenciaEstudianteRepository;

    constructor() {
        this.repository = new AsistenciaEstudianteRepository();
        this.registrarAsistenciasUseCase = new RegistrarAsistenciasUseCase(this.repository);
        this.obtenerPaseListaUseCase = new ObtenerPaseListaUseCase(this.repository);
    }

    async registrarAsistencias(req: Request, res: Response): Promise<void> {
        try {
            const request: RegistroAsistenciasRequest = req.body;
            
            // Validaciones básicas
            if (!request.id_grupo || !request.id_asignatura || !request.fecha || !request.asistencias) {
                res.status(400).json({ 
                    message: 'Faltan campos requeridos: id_grupo, id_asignatura, fecha, asistencias' 
                });
                return;
            }

            if (!Array.isArray(request.asistencias) || request.asistencias.length === 0) {
                res.status(400).json({ 
                    message: 'El campo asistencias debe ser un array no vacío' 
                });
                return;
            }

            const asistenciasRegistradas = await this.registrarAsistenciasUseCase.execute(request);
            res.status(201).json({
                message: 'Asistencias registradas exitosamente',
                data: asistenciasRegistradas
            });
        } catch (error) {
            console.error('Error al registrar asistencias:', error);
            res.status(500).json({ 
                message: 'Error interno del servidor al registrar asistencias',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }

    async obtenerPaseLista(req: Request, res: Response): Promise<void> {
        try {
            const { fecha, id_grupo, id_asignatura } = req.query;
            
            // Validaciones
            if (!fecha || !id_grupo || !id_asignatura) {
                res.status(400).json({ 
                    message: 'Faltan parámetros requeridos: fecha, id_grupo, id_asignatura' 
                });
                return;
            }

            const paseListaData = await this.obtenerPaseListaUseCase.execute(
                fecha as string,
                parseInt(id_grupo as string),
                parseInt(id_asignatura as string)
            );
            
            res.json({
                message: 'Pase de lista obtenido exitosamente',
                data: paseListaData
            });
        } catch (error) {
            console.error('Error al obtener pase de lista:', error);
            res.status(500).json({ 
                message: 'Error interno del servidor al obtener pase de lista',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
}