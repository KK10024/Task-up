import { ITask } from '../dto/task.dto';
import { AppDataSource } from '../config/db';
import { Task } from '../entity/task.entity';
import { TaskStatus } from '../entity/task.status'; // enum import
import { AppError } from '../util/AppError';

export const taskRepository = {
    // 새로운 Task 엔티티 생성 후 저장
    createTask: async (newTask: ITask) => {
        const repository = AppDataSource.getRepository(Task);
        const task = repository.create(newTask); // 여기서 create() 호출
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

    findTaskById: async (task_id: number) => {
        const repository = AppDataSource.getRepository(Task);
        return await repository.findOne({
            where: { id: task_id },
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

    updateTask: async (task: Task) => {
        const repository = AppDataSource.getRepository(Task);
        return await repository.save(task);
    },

    softDeleteTask: async (task_id: number) => {
        const repository = AppDataSource.getRepository(Task);
        return await repository.softDelete(task_id);
    },
};