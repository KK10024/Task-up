import { ITask } from '../dto/task.dto';
import { AppDataSource } from '../config/db';
import { Task } from '../entity/task.entity';
import { TaskStatus } from '../entity/task.status';
import { FindOptionsWhere } from 'typeorm';
import dayjs from 'dayjs';

const repository = AppDataSource.getRepository(Task);

export const taskRepository = {
    createTask: async (newTask: ITask) => {
        const task = repository.create(newTask);
        return await repository.save(task);
    },

    findTasksWithPagination: async (page: number, pageSize: number, status?: string) => {
        const statusCheck: FindOptionsWhere<Task> = status ? { status: status as TaskStatus } : {};
        const [tasks, total] = await repository.findAndCount({
            where: statusCheck,
            relations: ['user'],
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        return { tasks, total };
    },

    findTaskById: async (taskId: number) => {
        return await repository.findOne({
            where: { id: taskId },
            relations: ['user'],
        });
    },
    findTaskByCalender : async (clenderDate : any): Promise<Task[]> => {
        return await repository
          .createQueryBuilder('task')
          .leftJoinAndSelect('task.user', 'user')
          .where('task.startDate >= :start', { start: clenderDate.start })
          .andWhere('task.startDate <= :end', { end: clenderDate.end })
          .select(['task', 'user.name'])
          .getMany();
    },
    findTaskWithMembers: async(taskId: number): Promise<Task | null> => {
        return await repository.createQueryBuilder('task')
            .leftJoinAndSelect('task.user', 'user')
            .where('task.id = :taskId', { taskId })
            .getOne();
    },
    getTasksDue: async (): Promise<{ taskId: number; messages: string[]; }[]> => {
        const today = dayjs();
        
        const deadlines = [1, 3, 7].map(days => today.add(days, 'day'));
        
        const formatDate = (date: dayjs.Dayjs) => {
            return date.format('YYYY-MM-DD:00:00:00');
        };
    
        const formattedDeadlines = deadlines.map(formatDate);
    
        // 작업 조회
        const tasks = await repository
            .createQueryBuilder('task')
            .leftJoinAndSelect('task.user', 'user')
            .where('task.taskSchedule = :taskSchedule', { taskSchedule: true })
            .andWhere(
                '((task.endDate IN (:...dates) AND task.updatedAt <= task.endDate))',
                { dates: formattedDeadlines }
            )
            .getMany();
    
        const notifications: { taskId: number; messages: string[]; }[] = [];
    
        for (const task of tasks) {
            const { id: taskId, title, endDate, status, members } = task;
            const messages: string[] = [];
    
            // 남은 기간 알림 생성
            const remainingDays = dayjs(endDate).diff(today, 'day');
            const formattedEndDate = dayjs(endDate).format('YYYY.MM.DD:00:00:00');
    
            if (status === 'COMPLETED') {
                messages.push(`완료됨: 작업 '${title}'이 완료되었습니다.`);
                await repository.update(taskId, { taskSchedule: false });
            } else {
                switch (remainingDays) {
                    case 1:
                        messages.push(`하루 남았습니다: 작업 '${title}'의 종료일: ${formattedEndDate}`);
                        break;
                    case 3:
                        messages.push(`3일 남았습니다: 작업 '${title}'의 종료일: ${formattedEndDate}`);
                        break;
                    case 7:
                        messages.push(`7일 남았습니다: 작업 '${title}'의 종료일: ${formattedEndDate}`);
                        break;
                }
            }
    
            if (messages.length > 0) {
                members.forEach(member => {
                    notifications.push({ taskId, messages: [`참여자에게 알림 전송: ${messages.join(', ')}`] });
                });
            }
        }
    
        return notifications;
    },
    updateTask: async (task: Task) => {
        return await repository.save(task);
    },
    softDeleteTask: async (taskId: number) => {
        return await repository.softDelete(taskId);
    },
};