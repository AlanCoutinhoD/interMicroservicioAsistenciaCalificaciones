import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('alumno_curso_grupo')
export class AlumnoCursoGrupoEntity {
    @PrimaryGeneratedColumn()
    id_alumno_curso_grupo!: number;

    @Column()
    id_estudiante!: number;

    @Column()
    id_grupo!: number;

    @Column()
    id_asignatura!: number;

    constructor(partial: Partial<AlumnoCursoGrupoEntity>) {
        Object.assign(this, partial);
    }
}