import { Request, Response } from 'express';
import { GetEstudiantesPorGrupoYAsignaturaUseCase } from '../../../application/usecases/GetEstudiantesPorGrupoYAsignaturaUseCase';
import { AlumnoCursoGrupoRepository } from '../../persistence/repositories/AlumnoCursoGrupoRepository';
import { EstudianteRepository } from '../../persistence/repositories/EstudianteRepository';

export class EstudiantesCursoController {
    private getEstudiantesUseCase: GetEstudiantesPorGrupoYAsignaturaUseCase;

    constructor() {
        const alumnoCursoGrupoRepository = new AlumnoCursoGrupoRepository();
        const estudianteRepository = new EstudianteRepository();
        this.getEstudiantesUseCase = new GetEstudiantesPorGrupoYAsignaturaUseCase(
            alumnoCursoGrupoRepository,
            estudianteRepository
        );
    }

    async getEstudiantesPorGrupoYAsignatura(req: Request, res: Response): Promise<void> {
        try {
            const { id_grupo, id_asignatura } = req.query;
            
            if (!id_grupo || !id_asignatura) {
                res.status(400).json({
                    message: 'Los parámetros id_grupo e id_asignatura son requeridos'
                });
                return;
            }

            const estudiantes = await this.getEstudiantesUseCase.execute(
                parseInt(id_grupo as string),
                parseInt(id_asignatura as string)
            );

            res.json({
                estudiantes,
                total: estudiantes.length
            });
        } catch (error: any) {
            console.error('Error al obtener estudiantes:', error);
            res.status(500).json({
                message: 'Error al obtener los estudiantes del curso',
                error: error.message || 'Error desconocido'
            });
        }
    }
}