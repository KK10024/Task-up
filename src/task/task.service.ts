import { TaskStatus } from 'src/entity/task.status';
import { AppDataSource } from '../config/db';
import { createTaskDTO, taskUpdateDTO , TaskResponseDTO} from '../dto/task.dto';
import { Task } from '../entity/task.entity';
import { AppError } from '../util/AppError';
import { Request } from 'express';
import { getUserUUIDByName } from '../entity/user.repository';


export const taskService  = {
    createTask: async(taskcreateDTO: createTaskDTO) => {
        const {title, sub_title, content, status, members, startDate, endDate, user_id} = taskcreateDTO;

        // 입력값 체크 
        if(!title || !sub_title  || !content) throw new AppError('필수 입력값입니다.', 400);

        if(!user_id) throw new AppError('작성자는 필수입니다.', 400);
        
        const taskRepository = AppDataSource.getRepository(Task);

        // 입력된 사용자 이름으로 검색
        const memberUUIDs = await Promise.all(
            members.map(async (memberName) => {
                const uuid = await getUserUUIDByName(memberName);
                if (uuid) {
                    return uuid;
                }
                throw new AppError(`사용자를 찾을 수 없습니다: ${memberName}`, 404);
            })
        );
        const newTask = taskRepository.create({
            title,
            sub_title,
            content,
            status,
            members: memberUUIDs,
            startDate,
            endDate,
            user: {uuid: user_id}
          });
        const result = await taskRepository.save(newTask);

        return result;
    },
    readTask: async (req: Request) => {
        const taskRepository = AppDataSource.getRepository(Task);
        
        // 쿼리에서 페이지와 페이지 크기 가져오기
        const page = parseInt(req.query.page as string) || 1; // 기본값은 1페이지
        const pageSize = parseInt(req.query.pageSize as string) || 10; // 기본값은 10개 항목

        const [tasks, total] = await taskRepository.findAndCount({
            relations: ['user'],
            skip: (page - 1) * pageSize, // 페이지에 따라 건너뛸 항목 수
            take: pageSize, // 가져올 항목 수
        });

        const result = tasks.map(task => new TaskResponseDTO(task));
        return {
            total, // 총 작업 수
            page, // 현재 페이지
            pageSize, // 페이지 크기
            data: result, // 작업 데이터
        };
    },
    readOneTask: async(task_id: number) => {
        const taskRepository = AppDataSource.getRepository(Task);

        const task = await taskRepository.findOne({
            where: {
                id: task_id, 
            },
            relations: ['user'],
        });
        if (!task) throw new AppError('프로젝트를 찾을 수 없습니다', 404);
        const result = new TaskResponseDTO(task);
        return result;
    },
    readTasksByStatus: async (status: TaskStatus) => {
        const taskRepository = AppDataSource.getRepository(Task);
        const task = await taskRepository.find({
            where: {
                status,
            },
            relations: ['user'], 
        });
        if (!task.length) throw new AppError('프로젝트를 찾을 수 없습니다', 404);
        
        return task.map(task => new TaskResponseDTO(task));
    },
    updateTask: async(task_id: number, taskupdateDTO: taskUpdateDTO) => {
        const taskRepository = AppDataSource.getRepository(Task);
        const task = await taskRepository.findOne({
            where:{
                id: task_id
            },
            relations: ['user'],
        });
        if (!task) throw new AppError('프로젝트를 찾을 수 없습니다', 404);

        Object.assign(task, taskupdateDTO);

        await taskRepository.save(task);

        return new TaskResponseDTO(task);;
    },
    deleteTask: async(task_id: number) => {
        const taskRepository = AppDataSource.getRepository(Task);
        const task = await taskRepository.softDelete(task_id);
        if (task.affected === 0) throw new AppError('프로젝트를 찾을 수 없습니다.', 404);
    }
}