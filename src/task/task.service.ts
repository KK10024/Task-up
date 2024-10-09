import { AppDataSource } from '../config/db';
import { taskCreateDTO, taskUpdateDTO } from '../dto/task.dto';
import { Task } from '../entity/task.entity';
import { AppError } from '../util/AppError';


export const taskService  = {
    createTask: async(taskcreateDTO: taskCreateDTO) => {
        const {title, sub_title, content, user_id} = taskcreateDTO;

        // 입력값 체크 
        if(!title || !sub_title  || !content) throw new AppError('필수 입력값입니다.', 400);

        if(!user_id) throw new AppError('작성자는 필수입니다.', 400);
        
        const taskRepository = AppDataSource.getRepository(Task);

        const newTask = taskRepository.create({
            title,
            sub_title,
            content,
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
        return task.map(task => ({ 
            id: task.id, 
            title: task.title, 
            sub_title: task.sub_title, 
            content: task.content,
            user: {
                user_id:task.user.uuid,
                username:task.user.name
            }
        }));
    },
    readOneTask: async(task_id: number) => {
        const taskRepository = AppDataSource.getRepository(Task);

        const task = await taskRepository.findOne({
            where: {
                id: task_id, 
            },
        });
        if (!task) throw new AppError('프로젝트를 찾을 수 없습니다', 404);
    
        return task
    },
    updateTask: async(task_id: number, taskupdateDTO: taskUpdateDTO) => {
        const taskRepository = AppDataSource.getRepository(Task);
        const task = await taskRepository.findOne({
            where:{
                id: task_id
            },
        });
        if (!task) throw new AppError('프로젝트를 찾을 수 없습니다', 404);

        Object.assign(task, taskupdateDTO);
        await taskRepository.save(task);

        return task;
    },
    deleteTask: async(task_id: number) => {
        const taskRepository = AppDataSource.getRepository(Task);
        const task = await taskRepository.softDelete(task_id);
        if (task.affected === 0) throw new AppError('프로젝트를 찾을 수 없습니다.', 404);
    }
}