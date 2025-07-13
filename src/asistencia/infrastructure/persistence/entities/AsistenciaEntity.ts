import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { EstadoAsistencia } from '../../../domain/enums/EstadoAsistencia';

@Entity('registros_asistencia')
export class AsistenciaEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  estudiante_id!: number;

  @Column({ type: 'int' })
  curso_id!: number;

  @Column({ type: 'date' })
  fecha!: Date;

  @Column({
    type: 'enum',
    enum: EstadoAsistencia,
    default: EstadoAsistencia.Presente
  })
  estado!: EstadoAsistencia;

  @Column({ type: 'int' })
  registrado_por_usuario_id!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  constructor(partial: Partial<AsistenciaEntity>) {
    Object.assign(this, partial);
  }
}