import { ITask } from '../dto/task.dto';
import { AppDataSource } from '../config/db';
import { Task } from '../entity/task.entity';
import { TaskStatus } from '../entity/task.status';
import { FindOptionsWhere } from 'typeorm';

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
          .where('task.startDate >= :start', { start: clenderDate.start })
          .andWhere('task.startDate <= :end', { end: clenderDate.end })
          .getMany();
      },
    findTaskWithMembers: async(taskId: number): Promise<Task | null> => {
        return await repository.createQueryBuilder('task')
            .leftJoinAndSelect('task.user', 'user')
            .where('task.id = :taskId', { taskId })
            .getOne();
    },
    // 코드가 좀 난해해졌음 리펙토링 필요
    getTasksDue: async (): Promise<{ taskId: number; messages: string[]; }[]> => {
        const today = new Date();
        const oneDayBefore = new Date(today.getTime() + (1 * 24 * 60 * 60 * 1000));
        const threeDaysBefore = new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000)); 
        const sevenDaysBefore = new Date(today.getTime() + (6 * 24 * 60 * 60 * 1000)); 
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}:00:00:00`;
        };
        const formattedOneDayBefore = formatDate(oneDayBefore);
        const formattedThreeDaysBefore = formatDate(threeDaysBefore);
        const formattedSevenDaysBefore = formatDate(sevenDaysBefore);

        // 작업 조회
        const tasks = await repository
        .createQueryBuilder('task')
        .leftJoinAndSelect('task.user', 'user')
        .where(
            '((task.endDate IN (:...dates) AND task.updatedAt <= task.endDate) OR task.updatedAt > task.endDate)',
            { dates: [formattedOneDayBefore, formattedThreeDaysBefore, formattedSevenDaysBefore] }
        )
        .orWhere('task.status = :status', { status: 'COMPLETED' })
        .getMany();

        
        const notifications: { taskId: number; messages: string[]; }[] = [];
    
        tasks.forEach(task => {
            const { id: taskId, title, endDate, status, user, members } = task;
            const messages: string[] = [];
    
            // 남은 기간 알림 생성
            const remainingDays = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
            const formattedEndDate = `${endDate.getFullYear()}.${String(endDate.getMonth() + 1).padStart(2, '0')}.${String(endDate.getDate()).padStart(2, '0')}:00:00:00`;
            if (status === 'COMPLETED') {
                messages.push(`완료됨: 작업 '${title}'이 완료되었습니다.`);
            } else {
                if (remainingDays === 1) {
                    messages.push(`하루 남았습니다: 작업 '${title}'의 종료일: ${formattedEndDate}`);
                } else if (remainingDays === 3) {
                    messages.push(`3일 남았습니다: 작업 '${title}'의 종료일: ${formattedEndDate}`);
                } else if (remainingDays === 6) {
                    messages.push(`7일 남았습니다: 작업 '${title}'의 종료일: ${formattedEndDate}`);
                }
            }
        
            // 수정 알림 생성 (한 번만 처리)
            if (task.updatedAt > endDate) {
                messages.push(`수정됨: 작업 '${title}'이 수정되었습니다.`);
            }
    
            // 작성자에게 알림 전송
            // if (messages.length > 0) {
            //     notifications.push({ taskId, messages: [`작성자에게 알림 전송: ${messages.join(', ')}`] }); // 작성자에게 알림 추가
            // }
    
            // 참여자에게 알림 전송
            if (members.length > 0) {
                members.forEach(member => {
                    notifications.push({ taskId, messages: [`참여자에게 알림 전송: ${messages.join(', ')}`] }); // 참여자에게 알림 추가
                });
            }
        });
    
        return notifications;
    },
    updateTask: async (task: Task) => {
        return await repository.save(task);
    },
    softDeleteTask: async (taskId: number) => {
        return await repository.softDelete(taskId);
    },
};