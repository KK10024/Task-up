import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Task {
    @PrimaryGeneratedColumn()    
    id: number;

    @Column({ nullable: false })
    title: string;

    @Column({ nullable: false })
    sub_title: string;

    @Column('longtext')    
    content: string;

    @CreateDateColumn()
    createdAt: Date;
    
    @UpdateDateColumn()
    updatedAt: Date;
    
    @ManyToOne(() => User, (user) => user.tasks)
    user: User;
}