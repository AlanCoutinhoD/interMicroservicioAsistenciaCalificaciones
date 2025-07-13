import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('calificaciones')
export class CalificacionEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'estudiante_id' })
    estudiante_id!: number;

    @Column({ name: 'actividad_id' })
    actividad_id!: number;

    @Column('decimal', { precision: 5, scale: 2 })
    nota!: number;

    @Column({ name: 'fecha_registro', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha_registro!: Date;

    constructor(partial: Partial<CalificacionEntity>) {
        Object.assign(this, partial);
    }
}