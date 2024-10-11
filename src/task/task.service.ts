import { taskRepository } from '../repository/task.repository';
import { createTaskDTO, taskUpdateDTO , TaskResponseDTO, ITask, CalenderResDTO} from '../dto/task.dto';
import { AppError } from '../util/AppError';
import { userRepository } from '../repository/user.repository';

export const taskService = {
    createTask: async(taskcreateDTO: createTaskDTO) => {
        const { title, sub_title, content, status, members, startDate, endDate, user_id } = taskcreateDTO;
        
        // 입력값 체크 
        if (!title || !sub_title  || !content  || !members) throw new AppError('필수 입력값입니다.', 400);
        if (!user_id) throw new AppError('작성자는 필수입니다.', 400);

        // 이름으로 사용자 검색
        const member = await Promise.all(members.map(userRepository.getUserByName));
        
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

    readOneTask: async(taskId: number) => {
        const task = await taskRepository.findTaskById(taskId);
        if (!task) throw new AppError('프로젝트를 찾을 수 없습니다', 404);
        return new TaskResponseDTO(task);
    },

    readTasksByStatus: async (status: number) => {
        const task = await taskRepository.findTasksByStatus(status);
        if (!task.length) throw new AppError('프로젝트를 찾을 수 없습니다', 404);
        const result = task.map(task => new TaskResponseDTO(task))
        return result;
    },
    calenderTask: async (start: Date, end: Date) => {
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new Error("유효하지 않은 날짜 형식입니다.");
        }
        const calender = await taskRepository.findTaskByCalender(start, end);
        if(!calender) throw new AppError('프로젝트를 찾을 수 없습니다.',404)
        const result = calender.map(calender => new CalenderResDTO(calender))
        return result;
    },
    updateTask: async(taskId: number, taskupdateDTO: taskUpdateDTO) => {
        const task = await taskRepository.findTaskById(taskId);
        if (!task) throw new AppError('프로젝트를 찾을 수 없습니다', 404);

        if (taskupdateDTO.members) {
            const members = await Promise.all(taskupdateDTO.members.map(userRepository.getUserByName));
            if (!members.every(member => member)) throw new AppError('멤버를 찾을 수 없습니다.', 404);
            task.members = members; // 업데이트할 멤버로 설정
        }

        Object.assign(task, taskupdateDTO);
        const result = await taskRepository.updateTask(task);
        return new TaskResponseDTO(result);
    },

    deleteTask: async(taskId: number) => {
        const task = await taskRepository.softDeleteTask(taskId);
        if (task.affected === 0) throw new AppError('프로젝트를 찾을 수 없습니다.', 404);
    }
};