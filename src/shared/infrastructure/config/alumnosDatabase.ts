import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { AlumnoEntity } from '../persistence/entities/AlumnoEntity';

dotenv.config();

export const AlumnosDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: 'alumnos', // Base de datos específica para alumnos
  synchronize: false, // No sincronizar automáticamente en producción
  logging: process.env.NODE_ENV === 'development',
  entities: [AlumnoEntity],
  migrations: [],
  extra: {
    authPlugin: 'mysql_native_password'
  }
});
