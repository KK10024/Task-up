import { TaskStatus } from 'src/entity/task.status';
import { AppDataSource } from '../config/db';
import { createTaskDTO, taskUpdateDTO , TaskResponseDTO} from '../dto/task.dto';
import { Task } from '../entity/task.entity';
import { AppError } from '../util/AppError';


export const taskService  = {
    createTask: async(taskcreateDTO: createTaskDTO) => {
        const {title, sub_title, content, status, members, startDate, endDate, user_id} = taskcreateDTO;

        // 입력값 체크 
        if(!title || !sub_title  || !content) throw new AppError('필수 입력값입니다.', 400);

        if(!user_id) throw new AppError('작성자는 필수입니다.', 400);
        
        const taskRepository = AppDataSource.getRepository(Task);

        const newTask = taskRepository.create({
            title,
            sub_title,
            content,
            status,
            members,
            startDate,
            endDate,
            user: {uuid: user_id}
          });
        const result = await taskRepository.save(newTask);

        return result;
    },
    readTask: async() => {
        const taskRepository = AppDataSource.getRepository(Task);
        const task = await taskRepository.find({
            relations: ['user'],
        }); 
        const result = task.map(task => new TaskResponseDTO(task))
        return result;
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