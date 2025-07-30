import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { CalificacionEntity } from '../../../calificacion/infrastructure/persistence/entities/CalificacionEntity';
import { AsistenciaTutoradoEntity } from '../../../asistencia-tutorado/infrastructure/persistence/entities/AsistenciaTutoradoEntity';
import { AlumnoCursoGrupoEntity } from '../../../estudiantes-curso/infrastructure/persistence/entities/AlumnoCursoGrupoEntity';
import { EstudianteEntity } from '../../../estudiantes-curso/infrastructure/persistence/entities/EstudianteEntity';
import { AsistenciaEstudianteEntity } from '../../../asistencia-estudiantes/infrastructure/persistence/entities/AsistenciaEstudianteEntity';

dotenv.config();

// Conexión para la base de datos de cursos
export const CursosDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_CURSOS_HOST,
  port: Number(process.env.DB_CURSOS_PORT),
  username: process.env.DB_CURSOS_USERNAME,
  password: process.env.DB_CURSOS_PASSWORD,
  database: process.env.DB_CURSOS_DATABASE,
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: [CalificacionEntity, AsistenciaTutoradoEntity, AlumnoCursoGrupoEntity, AsistenciaEstudianteEntity],
  migrations: [],
});

// Conexión para la base de datos de alumnos
export const AlumnosDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_ALUMNOS_HOST,
  port: Number(process.env.DB_ALUMNOS_PORT),
  username: process.env.DB_ALUMNOS_USERNAME,
  password: process.env.DB_ALUMNOS_PASSWORD,
  database: process.env.DB_ALUMNOS_DATABASE,
  synchronize: false, // Cambiar a false en producción
  logging: process.env.NODE_ENV === 'development',
  entities: [EstudianteEntity],
  migrations: [],
});

// Mantener compatibilidad con el código existente
export const AppDataSource = CursosDataSource;