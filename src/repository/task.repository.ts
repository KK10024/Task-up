import { AppDataSource } from '../config/db';
import { Task } from '../entity/task.entity';

export const taskRepository = {
    // 새로운 Task 엔티티 생성 후 저장
    createTask: async (newTask ) => {
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