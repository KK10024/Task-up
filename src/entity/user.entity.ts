import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Task } from './task.entity';
@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false , unique: true})
    email: string;

    @Column({ nullable: false })
    password: string;
    
    @OneToMany(() => Task, (task) => task.user)
    tasks: Task[];
}