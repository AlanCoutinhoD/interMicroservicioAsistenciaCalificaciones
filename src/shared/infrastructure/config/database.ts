import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { AsistenciaEntity } from '../../../asistencia/infrastructure/persistence/entities/AsistenciaEntity';
import { CalificacionEntity } from '../../../calificacion/infrastructure/persistence/entities/CalificacionEntity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  entities: [AsistenciaEntity, CalificacionEntity],
  migrations: [],
});