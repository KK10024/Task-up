import { taskRepository } from '../repository/task.repository';
import { createTaskDTO, taskUpdateDTO , TaskResponseDTO, ITask} from '../dto/task.dto';
import { AppError } from '../util/AppError';
import { getUserByName, userRepository } from '../repository/user.repository';
import { TaskStatus } from '../entity/task.status';

export const taskService = {
    createTask: async(taskcreateDTO: createTaskDTO) => {
        const { title, sub_title, content, status, members, startDate, endDate, user_id } = taskcreateDTO;
        
        // 입력값 체크 
        if (!title || !sub_title  || !content || !status || !members) throw new AppError('필수 입력값입니다.', 400);
        if (!user_id) throw new AppError('작성자는 필수입니다.', 400);

        // 이름으로 사용자 검색
        const member = await Promise.all(members.map(getUserByName));
        
        const newTask: ITask= {
            title,
            sub_title,
            content,
            status,
            members: member,
            startDate,
            endDate,
            user : {uuid: user_id} 
        };
        const result = await taskRepository.createTask(newTask)
        return new TaskResponseDTO(result);
    },

    readTask: async (page: number, pageSize: number) => {
        const { tasks, total } = await taskRepository.findTasksWithPagination(page, pageSize);
        return {
            total,
            page,
            pageSize,
            data: tasks.map(task => new TaskResponseDTO(task)),
        };
    },

    readOneTask: async(task_id: number) => {
        const task = await taskRepository.findTaskById(task_id);
        if (!task) throw new AppError('프로젝트를 찾을 수 없습니다', 404);
        return new TaskResponseDTO(task);
    },

    readTasksByStatus: async (status: number) => {
        console.log(status);
        const tasks = await taskRepository.findTasksByStatus(status);
        if (!tasks.length) throw new AppError('프로젝트를 찾을 수 없습니다', 404);
        const result = tasks.map(task => new TaskResponseDTO(task))
        return result;
    },

    updateTask: async(task_id: number, taskupdateDTO: taskUpdateDTO) => {
        const task = await taskRepository.findTaskById(task_id);
        if (!task) throw new AppError('프로젝트를 찾을 수 없습니다', 404);

        if (taskupdateDTO.members) {
            const members = await Promise.all(taskupdateDTO.members.map(getUserByName));
            if (!members.every(member => member)) throw new AppError('멤버를 찾을 수 없습니다.', 404);
            task.members = members; // 업데이트할 멤버로 설정
        }

        Object.assign(task, taskupdateDTO);
        const result = await taskRepository.updateTask(task);
        return new TaskResponseDTO(result);
    },

    deleteTask: async(task_id: number) => {
        const task = await taskRepository.softDeleteTask(task_id);
        if (task.affected === 0) throw new AppError('프로젝트를 찾을 수 없습니다.', 404);
    }
};