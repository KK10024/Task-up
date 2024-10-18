import { taskRepository } from '../repository/task.repository';
import { createTaskDTO, taskUpdateDTO , TaskResponseDTO, ITask, CalenderResDTO, calenderReqDTO} from '../dto/task.dto';
import { AppError, BadReqError, NotFoundError } from '../util/AppError';
import { userRepository } from '../repository/user.repository';
import { calendarUtil } from '../util/DateUtil';
import dayjs from 'dayjs';

export const taskService = {
    createTask: async(taskcreateDTO: createTaskDTO) => {
        const { title, subTitle, content, status, members, startDate, endDate, userId } = taskcreateDTO;
        
        //dto로 받는데 왜 검증해야함?
        if (!title || !subTitle  || !content) throw new BadReqError('필수 입력값입니다.');
        if (!userId) throw new BadReqError('작성자는 필수입니다.');

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
        if (!task) throw new BadReqError('프로젝트를 찾을 수 없습니다');
        return new TaskResponseDTO(task);
    },

    calenderTask: async (calenderReqdto: calenderReqDTO) => {
        const { startDate, type } = calenderReqdto;

        if (!dayjs(startDate).isValid()) {
            throw new BadReqError('startDate 형식이 잘못되었습니다.');
        }
        const clenderDate = calendarUtil(startDate, type);
        const calender = await taskRepository.findTaskByCalender(clenderDate);
        
        if(!calender) throw new NotFoundError('프로젝트를 찾을 수 없습니다.');

        const result = calender.map(calender => new CalenderResDTO(calender))
        return result;
    },
    updateTask: async (taskId: number, userId: string, taskupdateDTO: taskUpdateDTO) => {

        const user = await userRepository.getUserByUuid(userId);
        if(!user) throw new BadReqError("수정할 권한이 없습니다")

        const task = await taskRepository.findTaskById(taskId);
        if (!task) throw new NotFoundError('프로젝트를 찾을 수 없습니다.');
        
        //members 들어오는 부분 처리 
        if (taskupdateDTO.members) {
            const members = await Promise.all(
                taskupdateDTO.members.map(async (member) => {
                    const user = await userRepository.getUserByName(member.name);
                    if (!user) {
                        throw new NotFoundError(`사용자를 찾을 수 없습니다: ${member.name}`);
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
    deleteTask: async(taskId: number, userId: string) => {
        const user = await userRepository.getUserByUuid(userId);
        if(!user) throw new BadReqError("삭제할 권한이 없습니다");

        const task = await taskRepository.softDeleteTask(taskId);
        if (task.affected === 0) throw new NotFoundError('프로젝트를 찾을 수 없습니다.');
    }
};