import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { ImgType } from './img.types';
@Entity()
export class Img {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type_id: string;

    @Column({type: 'enum', enum: ImgType})
    type: ImgType;
    
    @Column()
    img_addr: string;

    @CreateDateColumn({type:'datetime', name:"created_at"})
    createdAt: Date;
    
    @UpdateDateColumn({type:'datetime', name:"updated_at"})
    updatedAt: Date;

    @DeleteDateColumn({ type: 'datetime', name: 'deleted_at', nullable: true })
    deletedAt: Date | null;
}