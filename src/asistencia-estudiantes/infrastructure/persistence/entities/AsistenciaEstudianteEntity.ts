import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('asistencia')
export class AsistenciaEstudianteEntity {
    @PrimaryGeneratedColumn()
    id_asistencia!: number;

    @Column()
    id_alumno!: number;

    @Column()
    id_grupo!: number;

    @Column()
    id_asignatura!: number;

    @Column({ length: 20 })
    estado!: string;

    @CreateDateColumn()
    fecha!: Date;

    constructor(partial: Partial<AsistenciaEstudianteEntity>) {
        Object.assign(this, partial);
    }
}