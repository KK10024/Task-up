import { ITask } from '../dto/task.dto';
import { AppDataSource } from '../config/db';
import { Task } from '../entity/task.entity';
import dayjs from 'dayjs';

const repository = AppDataSource.getRepository(Task);

export const taskRepository = {
    createTask: async (newTask: ITask) => {
        const task = repository.create(newTask);
        return await repository.save(task);
    },

    findTasksWithPagination: async (page: number, pageSize: number, userId: string, status?: string) => {
        const queryBuilder = repository.createQueryBuilder('task')
            .leftJoinAndSelect('task.user', 'user')
            .where('user.uuid = :userId', { userId })
            .skip((page - 1) * pageSize)
            .take(pageSize);
            
        // status가 있는 경우 추가
        if (status) {
            queryBuilder.andWhere('task.status = :status', { status });
        }
        queryBuilder.orWhere('JSON_SEARCH(task.members, "one", :uuid, NULL, "$[*].uuid") IS NOT NULL', { uuid: userId });

        const [tasks, total] = await queryBuilder.getManyAndCount();
        return { tasks, total };
    },

    findTaskById: async (taskId: number) => {
        return await repository.findOne({
            where: { id: taskId },
            relations: ['user'],
        });
    },
    findTaskByCalender : async (clenderDate : any, userId: string): Promise<Task[]> => {
        return await repository
          .createQueryBuilder('task')
          .leftJoinAndSelect('task.user', 'user')
          .where('user.uuid = :userId', { userId })
          .orWhere('JSON_SEARCH(task.members, "one", :uuid, NULL, "$[*].uuid") IS NOT NULL', { uuid: userId })
          .where('task.startDate >= :start', { start: clenderDate.start })
          .andWhere('task.startDate <= :end', { end: clenderDate.end })
          .select(['task', 'user.name'])
          .getMany();
    },
    getTasksDue: async (): Promise<{ taskId: number; messages: string[]; user: any; }[]> => {
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
                '((task.endDate IN (:...dates)))',
                { dates: formattedDeadlines }
            )
            .getMany();
            const notifications: { taskId: number; messages: string[]; user: { uuid: string, name: string }; }[] = [];
        for (const task of tasks) {
            const { id: taskId, title, endDate, status, members, user } = task;
            const messages: string[] = [];
            const remainingDays = dayjs(endDate).diff(today, 'day') +1;
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
            notifications.push({
                taskId,
                messages: [`작성자 ${user.name}에게 알림 전송 : ${messages.join(', ')}`],
                user: { uuid: user.uuid, name: user.name }
            });
            members.forEach(member => {
                if (member.uuid !== user.uuid) {
                    notifications.push({
                        taskId,
                        messages: [`참여자 ${member.name}에게 알림 전송: ${messages.join(', ')}`],
                        user: { uuid: member.uuid, name: member.name }
                    });
                }
            });
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