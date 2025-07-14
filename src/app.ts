import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './shared/infrastructure/config/database';
import asistenciaRoutes from './asistencia/infrastructure/http/routes/asistencia.routes';
import calificacionRoutes from './calificacion/infrastructure/http/routes/calificacion.routes';
import asistenciaTutoradoRoutes from './asistencia-tutorado/infrastructure/http/routes/asistencia-tutorado.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', asistenciaRoutes);
app.use('/api', calificacionRoutes);

// Agregar las rutas de asistencia tutorado
app.use('/api/asistencia-tutorado', asistenciaTutoradoRoutes);

// Inicializar conexión a la base de datos
AppDataSource.initialize()
  .then(() => {
    console.log('Base de datos conectada');
  })
  .catch((error) => {
    console.error('Error al conectar la base de datos:', error);
  });

export default app;