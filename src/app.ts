import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { CursosDataSource, AlumnosDataSource } from './shared/infrastructure/config/databases';
import calificacionRoutes from './calificacion/infrastructure/http/routes/calificacion.routes';
import asistenciaTutoradoRoutes from './asistencia-tutorado/infrastructure/http/routes/asistencia-tutorado.routes';
import estudiantesCursoRoutes from './estudiantes-curso/infrastructure/http/routes/estudiantes-curso.routes';
import { asistenciaEstudiantesRoutes } from './asistencia-estudiantes/infrastructure/http/routes/asistencia-estudiantes.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/asistencia-tutorado', asistenciaTutoradoRoutes);
app.use('/api', calificacionRoutes);
app.use('/api/cursos', estudiantesCursoRoutes);
app.use('/api/asistencia-estudiantes', asistenciaEstudiantesRoutes);

// Inicializar conexiones a las bases de datos
Promise.all([
  CursosDataSource.initialize(),
  AlumnosDataSource.initialize()
])
  .then(() => {
    console.log('Bases de datos conectadas exitosamente');
    console.log('- Base de datos de cursos: conectada');
    console.log('- Base de datos de alumnos: conectada');
  })
  .catch((error) => {
    console.error('Error al conectar las bases de datos:', error);
  });

export default app;