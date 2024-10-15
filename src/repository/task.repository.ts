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
    getTasksDue: async () => {
        const today = new Date();
        const oneDayBefore = new Date(today.getTime() + (24 * 60 * 60 * 1000));
        const threeDaysBefore = new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000));
        const sevenDaysBefore = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));
    
        return await repository
            .createQueryBuilder('task')
            .where('task.endDate = :oneDayBefore', { oneDayBefore })
            .orWhere('task.endDate = :threeDaysBefore', { threeDaysBefore })
            .orWhere('task.endDate = :sevenDaysBefore', { sevenDaysBefore })
            .orWhere('task.status = :status', { status: 'completed' })
            .orWhere('task.updatedAt > task.endDate')
            .getMany();
    },
    updateTask: async (task: Task) => {
        return await repository.save(task);
    },
    softDeleteTask: async (taskId: number) => {
        return await repository.softDelete(taskId);
    },
};