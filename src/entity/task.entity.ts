import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn} from 'typeorm';
import { TaskStatus } from './task.status';
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

    @Column({type: 'enum', enum: TaskStatus, default: TaskStatus.IN_PROGRESS})
    status: TaskStatus;

    @Column("json")
    members: { uuid: string; name: string;}[];

    @Column({type:'datetime', name:'start_date'})
    startDate: Date;

    @Column({type:'datetime', name:'end_date'})
    endDate: Date;

    @CreateDateColumn({type:'datetime', name:"created_at"})
    createdAt: Date;
    
    @UpdateDateColumn({type:'datetime', name:"updated_at"})
    updatedAt: Date;

    @DeleteDateColumn({ type: 'datetime', name: 'deleted_at', nullable: true }) // 삭제를 위한 삭제 날짜 저장 컬럼
    deletedAt: Date | null;

    @ManyToOne(() => User, (user) => user.tasks)
    user: User;
}