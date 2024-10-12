import { ITask } from '../dto/task.dto';
import { AppDataSource } from '../config/db';
import { Task } from '../entity/task.entity';
import { TaskStatus } from '../entity/task.status';
import { AppError } from '../util/AppError';
import { FindOptionsWhere, createQueryBuilder } from 'typeorm';

export const taskRepository = {
    createTask: async (newTask: ITask) => {
        const repository = AppDataSource.getRepository(Task);
        const task = repository.create(newTask);
        return await repository.save(task);
    },

    findTasksWithPagination: async (page: number, pageSize: number, status?: string) => {
        const statusCheck: FindOptionsWhere<Task> = status ? { status: status as TaskStatus } : {};

        const repository = AppDataSource.getRepository(Task);
        const [tasks, total] = await repository.findAndCount({
            where: statusCheck,
            relations: ['user'],
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        return { tasks, total };
    },

    findTaskById: async (taskId: number) => {
        const repository = AppDataSource.getRepository(Task);
        return await repository.findOne({
            where: { id: taskId },
            relations: ['user'],
        });
    },
    findTaskByCalender : async (startDate : any): Promise<Task[]> => {
        const repository = AppDataSource.getRepository(Task);
        return await repository
          .createQueryBuilder('task')
          .where('task.startDate >= :start', { start: startDate.start })
          .andWhere('task.startDate <= :end', { end: startDate.end })
          .getMany();
      },
    updateTask: async (task: Task) => {
        const repository = AppDataSource.getRepository(Task);
        return await repository.save(task);
    },

    softDeleteTask: async (taskId: number) => {
        const repository = AppDataSource.getRepository(Task);
        return await repository.softDelete(taskId);
    },
};