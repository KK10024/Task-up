import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    title: string;

    @Column({ nullable: false })
    sub_title: string;

    @Column({ nullable: false })
    content: string;

    @ManyToOne(() => User, (user) => user.tasks)
    user: User; 
}