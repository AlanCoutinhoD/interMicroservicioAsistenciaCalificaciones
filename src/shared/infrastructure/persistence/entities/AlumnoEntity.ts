import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'estudiantes' }) // Nombre correcto de la tabla
export class AlumnoEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 6 })
    matricula!: string;

    @Column({ length: 255 })
    nombre!: string;

    @Column({ length: 100 })
    carrera!: string;

    @Column({ 
        name: 'estatus_alumno',
        type: 'enum',
        enum: ['Activo', 'Inactivo', 'Egresado', 'Baja Temporal', 'Baja Definitiva', 'Baja Académica'],
        default: 'Activo'
    })
    estatusAlumno!: string;

    @Column({ name: 'cuatrimestre_actual', length: 10 })
    cuatrimestreActual!: string;

    @Column({ name: 'grupo_actual', length: 10, nullable: true })
    grupoActual?: string;

    @Column({ length: 255, nullable: true })
    materia?: string;

    @Column({ length: 50, nullable: true })
    periodo?: string;

    @Column({ 
        name: 'estatus_materia',
        type: 'enum',
        enum: ['Sin cursar', 'Cursando', 'Aprobada', 'Aprobado', 'Reprobada', 'Reprobado'],
        default: 'Sin cursar',
        nullable: true
    })
    estatusMateria?: string;

    @Column({ nullable: true, default: 0 })
    final?: number;

    @Column({ length: 255, nullable: true, default: 'N/A' })
    extra?: string;

    @Column({ name: 'estatus_cardex', length: 50, nullable: true, default: 'Vigente' })
    estatusCardex?: string;

    @Column({ name: 'periodo_cursado', length: 50, nullable: true })
    periodoCursado?: string;

    @Column({ name: 'plan_estudios_clave', length: 50, nullable: true })
    planEstudiosClave?: string;

    @Column({ nullable: true })
    creditos?: number;

    @Column({ name: 'tutor_academico', length: 255, nullable: true })
    tutorAcademico?: string; // Ahora es STRING, no número

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;
}
