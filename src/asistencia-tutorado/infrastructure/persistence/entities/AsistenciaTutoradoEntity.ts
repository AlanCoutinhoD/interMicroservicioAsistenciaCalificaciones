import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { EstadoAsistenciaTutorado } from '../../../domain/enums/EstadoAsistenciaTutorado';

@Entity('registros_asistencia_tutorado')
export class AsistenciaTutoradoEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    tutor_id!: number;

    @Column()
    fecha!: Date;

    @Column({
        type: 'enum',
        enum: EstadoAsistenciaTutorado,
        default: EstadoAsistenciaTutorado.AUSENTE
    })
    estado!: EstadoAsistenciaTutorado;

    constructor(partial: Partial<AsistenciaTutoradoEntity>) {
        Object.assign(this, partial);
    }
}