import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Task {
    @PrimaryGeneratedColumn()    
    id: number;

    @Column({type:'varchar',length:'50', nullable: false })
    title: string;

    @Column({type:'varchar',length:'50', nullable: false })
    sub_title: string;

    @Column('longtext')    
    content: string;

    @Column({type:'boolean'})
    status:boolean;

    @Column({type: 'json'})
    members: number[];

    @Column({type:'datetime', name:'start_date'})
    startDate: Date;

    @Column({type:'datetime', name:'end_date'})
    endDate: Date;

    @CreateDateColumn({type:'datetime', name:"created_at"})
    createdAt: Date;
    
    @UpdateDateColumn({type:'datetime', name:"updated_at"})
    updatedAt: Date;
    
    @ManyToOne(() => User, (user) => user.tasks)
    user: User;
}