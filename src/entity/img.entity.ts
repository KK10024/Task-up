import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { ImgType } from './img.types';
@Entity()
export class Image {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    type: ImgType;  // 이미지 유형을 나타내는 값

    @Column()
    imgAddr: string;

    @CreateDateColumn({type:'datetime', name:"created_at"})
    createdAt: Date;
    
    @UpdateDateColumn({type:'datetime', name:"updated_at"})
    updatedAt: Date;

    @DeleteDateColumn({ type: 'datetime', name: 'deleted_at', nullable: true })
    deletedAt: Date | null;
}