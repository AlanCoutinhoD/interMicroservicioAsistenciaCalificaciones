import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { EstadoAsistenciaTutorado } from '../../../domain/enums/EstadoAsistenciaTutorado';

@Entity('registros_asistencia_tutorado')
export class AsistenciaTutoradoEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 255 })
    tutor_academico!: string; // Cambiado para coincidir con el modelo de estudiantes

    @Column({ type: 'varchar', length: 6 })
    matricula_estudiante!: string; // Matrícula del estudiante

    @Column({ type: 'varchar', length: 255 })
    nombre_estudiante!: string; // Nombre del estudiante

    @Column({ type: 'varchar', length: 100, nullable: true })
    carrera_estudiante?: string; // Carrera del estudiante

    @Column({ type: 'date' })
    fecha!: Date;

    @Column({
        type: 'enum',
        enum: EstadoAsistenciaTutorado,
        default: EstadoAsistenciaTutorado.AUSENTE
    })
    estado!: EstadoAsistenciaTutorado;

    @Column({ type: 'text', nullable: true })
    observaciones?: string; // Observaciones adicionales

    @CreateDateColumn()
    created_at!: Date;

    constructor(partial: Partial<AsistenciaTutoradoEntity>) {
        Object.assign(this, partial);
    }
}