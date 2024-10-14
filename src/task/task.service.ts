import { taskRepository } from '../repository/task.repository';
import { createTaskDTO, taskUpdateDTO , TaskResponseDTO, ITask, CalenderResDTO, calenderReqDTO} from '../dto/task.dto';
import { AppError } from '../util/AppError';
import { userRepository } from '../repository/user.repository';
import { calendarUtil } from '../util/DateUtil';

export const taskService = {
    createTask: async(taskcreateDTO: createTaskDTO) => {
        const { title, subTitle, content, status, members, startDate, endDate, userId } = taskcreateDTO;
        
        if (!title || !subTitle  || !content) throw new AppError('필수 입력값입니다.', 400);
        if (!userId) throw new AppError('작성자는 필수입니다.', 400);

        // 이름으로 사용자 검색
        const member = await Promise.all(members.map(userRepository.getUserByName));
        const newTask: ITask = {
            title,
            subTitle,
            content,
            status,
            members: member.map(member => ({
                uuid: member.uuid,
                name: member.name
            })),
            startDate,
            endDate,
            user: { uuid: userId }
        };
        const result = await taskRepository.createTask(newTask);
        return ;
    },

    readTask: async (page: number, pageSize: number, status?: string) => {
        const { tasks, total } = await taskRepository.findTasksWithPagination(page, pageSize, status);
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

    calenderTask: async (calenderReqdto: calenderReqDTO) => {
        const { startDate, type } = calenderReqdto;

        if (isNaN(new Date(startDate).getTime())) {
            throw new AppError('startDate 형식이 잘못되었습니다.', 400);
        }

        const clenderDate = calendarUtil(startDate, type);
        const calender = await taskRepository.findTaskByCalender(clenderDate);
       
        if(!calender) throw new AppError('프로젝트를 찾을 수 없습니다.',404)
        const result = calender.map(calender => new CalenderResDTO(calender))
        return result;
    },

    updateTask: async (taskId: number, taskupdateDTO: taskUpdateDTO) => {
        const task = await taskRepository.findTaskById(taskId);
        if (!task) throw new AppError('프로젝트를 찾을 수 없습니다.', 404);
        
        //members 들어오는 부분 처리 
        if (taskupdateDTO.members) {
            const members = await Promise.all(
                taskupdateDTO.members.map(async (member) => {
                    const user = await userRepository.getUserByName(member.name);
                    if (!user) {
                        throw new AppError(`사용자를 찾을 수 없습니다: ${member.name}`, 404);
                    }
                    return { uuid: user.uuid, name: user.name };
                })
            );
            task.members = members;
        }
        //members 뺴고 나머지
        const { members, ...rest } = taskupdateDTO;
        Object.assign(task, rest);
    
        const result = await taskRepository.updateTask(task);
        return new TaskResponseDTO(result);
    },
    deleteTask: async(taskId: number) => {
        const task = await taskRepository.softDeleteTask(taskId);
        if (task.affected === 0) throw new AppError('프로젝트를 찾을 수 없습니다.', 404);
    }
};