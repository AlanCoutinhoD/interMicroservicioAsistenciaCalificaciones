import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './shared/infrastructure/config/database';
import { AlumnosDataSource } from './shared/infrastructure/config/alumnosDatabase';
import asistenciaRoutes from './asistencia/infrastructure/http/routes/asistencia.routes';
import calificacionRoutes from './calificacion/infrastructure/http/routes/calificacion.routes';
import asistenciaTutoradoRoutes from './asistencia-tutorado/infrastructure/http/routes/asistencia-tutorado.routes';
import { informesTestRoutes } from './informes/infrastructure/http/routes/informes-test.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Rutas principales
app.use('/api', asistenciaRoutes);
app.use('/api', calificacionRoutes);

// Rutas de asistencia tutorado
app.use('/api/asistencia-tutorado', asistenciaTutoradoRoutes);

// Rutas de test para informes (sin dependencias complejas)
app.use('/api/informes', informesTestRoutes);

// Inicializar conexión a la base de datos principal
AppDataSource.initialize()
  .then(() => {
    console.log('Base de datos principal conectada');
  })
  .catch((error) => {
    console.error('Error al conectar la base de datos principal:', error);
  });

// Inicializar conexión a la base de datos de alumnos
AlumnosDataSource.initialize()
  .then(() => {
    console.log('Base de datos de alumnos conectada');
  })
  .catch((error) => {
    console.error('Error al conectar la base de datos de alumnos:', error);
  });

export default app;