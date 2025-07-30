import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('estudiantes')
export class EstudianteEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 7 })
    matricula!: string;

    @Column({ length: 255 })
    nombre!: string;

    @Column({ length: 255 })
    email!: string;

    @Column({
        type: 'enum',
        enum: ['Inscrito', 'Inactivo', 'Egresado', 'Baja Temporal', 'Baja Definitiva', 'Baja Académica']
    })
    estatus!: string;

    @Column({ length: 128 })
    tutor_academico_id!: string;

    @Column({ length: 3 })
    cohorte_id!: string;

    @Column()
    created_at!: Date;

    @Column()
    updated_at!: Date;

    constructor(partial: Partial<EstudianteEntity>) {
        Object.assign(this, partial);
    }
}