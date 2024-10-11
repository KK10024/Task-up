import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Task } from './task.entity';
@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ nullable: false , length: "10"})
    name: string;

    @Column({ nullable: false , length: "50", unique: true})
    email: string;

    @Column({ nullable: false , length: "30"})
    password: string;

    @CreateDateColumn({type:'datetime', name:"created_at"})
    createdAt: Date;
    
    @UpdateDateColumn({type:'datetime', name:"updated_at"})
    updatedAt: Date;

    @DeleteDateColumn({ type: 'datetime', name: 'deleted_at', nullable: true })
    deletedAt: Date | null;

    @OneToMany(() => Task, (task) => task.user)
    tasks: Task[];
}