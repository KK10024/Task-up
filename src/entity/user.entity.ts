import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, JoinColumn, OneToOne } from 'typeorm';
import { Task } from './task.entity';
import { Image } from './img.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ nullable: false , length: "10"})
    name: string;

    @Column({ nullable: false , length: "50", unique: true})
    email: string;

    @Column({ nullable: false , length: "60"})
    password: string;
    
    @CreateDateColumn({type:'datetime', name:"created_at"})
    createdAt: Date;
    
    @UpdateDateColumn({type:'datetime', name:"updated_at"})
    updatedAt: Date;

    @DeleteDateColumn({ type: 'datetime', name: 'deleted_at', nullable: true })
    deletedAt: Date | null;

    @OneToMany(() => Task, (task) => task.user)
    tasks: Task[];

    @OneToOne(() => Image, { nullable: true })
    @JoinColumn({ name: 'profile_image_id' })
    profileImage: Image | null; // 단일 이미지 객체 또는 nul
}