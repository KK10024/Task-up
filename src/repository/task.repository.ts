import { ITask } from '../dto/task.dto';
import { AppDataSource } from '../config/db';
import { Task } from '../entity/task.entity';
import { TaskStatus } from '../entity/task.status';
import { AppError } from '../util/AppError';
import {MoreThanOrEqual, LessThanOrEqual } from 'typeorm';

export const taskRepository = {
    createTask: async (newTask: ITask) => {
        const repository = AppDataSource.getRepository(Task);
        const task = repository.create(newTask);
        return await repository.save(task);
    },

    findTasksWithPagination: async (page: number, pageSize: number) => {
        const repository = AppDataSource.getRepository(Task);
        const [tasks, total] = await repository.findAndCount({
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

    findTasksByStatus: async (status: number) => {
        const repository = AppDataSource.getRepository(Task);
        if (!Object.values(TaskStatus).includes(status)) {
            throw new AppError('유효하지 않은 상태 값입니다.', 400);
        }
        return await repository.find({
            where: { status },
            relations: ['user'],
        });
    },
    findTaskByCalender: async(start: Date, end:Date) => {
        const repository = AppDataSource.getRepository(Task);
        const tasks = await repository.find({
            where: [
                {
                    startDate: MoreThanOrEqual(start),
                    endDate: LessThanOrEqual(end),
                },
                {
                    startDate: LessThanOrEqual(start),
                    endDate: MoreThanOrEqual(end),
                },
                {
                    startDate: MoreThanOrEqual(start),
                    endDate: LessThanOrEqual(end),
                }
            ],
            select: ["id", "title", "startDate", "endDate"],
        });
        return tasks;
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