import { taskRepository } from '../repository/task.repository';
import { createTaskDTO, taskUpdateDTO , TaskResponseDTO, ITask, CalenderResDTO, CalenderReqDTO, TaskQueryDTO} from '../dto/task.dto';
import { BadReqError, ForbiddenError, NotFoundError } from '../util/AppError';
import { userRepository } from '../repository/user.repository';
import { calendarUtil } from '../util/DateUtil';

export const taskService = {
    createTask: async (taskcreateDTO: createTaskDTO) => {
        const { title, subTitle, content, status, members, startDate, endDate, userId } = taskcreateDTO;
        if (!userId) throw new BadReqError('작성자는 필수입니다.');
    
        const memberResults = await Promise.all(members.map(userRepository.getUserByName));
        
        const uniqueMembers = new Set();
        const filteredMembers = [];
    
        for (let i = 0; i < memberResults.length; i++) {
            const member = memberResults[i];
            const memberName = members[i];
    
            if (!member) {
                throw new NotFoundError(`사용자를 찾을 수 없습니다: ${memberName}`);
            }
            if (uniqueMembers.has(member.name)) {
                throw new BadReqError(`중복된 사용자 이름입니다: ${member.name}`);
            }
            uniqueMembers.add(member.name);
            filteredMembers.push({ uuid: member.uuid, name: member.name });
        }
    
        const newTask: ITask = {
            title,
            subTitle,
            content,
            status,
            members: filteredMembers,
            startDate,
            endDate,
            user: { uuid: userId }
        };
        
        await taskRepository.createTask(newTask);
        return;
    },
    readTask: async (taskQuery : TaskQueryDTO, userId: string) => {
        const { page, pageSize, status} = taskQuery;
        const { tasks, total } = await taskRepository.findTasksWithPagination(page, pageSize, userId, status );
        return {
            total,
            page,
            pageSize,
            data: tasks.map(task => new TaskResponseDTO(task)),
        };
    },

    readOneTask: async(taskId: number) => {
        const task = await taskRepository.findTaskById(taskId);
        if (!task) throw new NotFoundError('프로젝트를 찾을 수 없습니다');
        return new TaskResponseDTO(task);
    },

    calenderTask: async (calenderReqdto: CalenderReqDTO, userId: string) => {
        const { startDate, type } = calenderReqdto;

        const clenderDate = calendarUtil(startDate, type);
        const calender = await taskRepository.findTaskByCalender(clenderDate, userId);
        if(!calender) throw new NotFoundError('프로젝트를 찾을 수 없습니다.');

        const result = calender.map(calender => new CalenderResDTO(calender))
        return result;
    },
    updateTask: async (taskId: number, userId: string, taskupdateDTO: taskUpdateDTO) => {

        const user = await userRepository.getUserByUuid(userId);
        if (!user) throw new ForbiddenError("수정할 권한이 없습니다");
    
        const task = await taskRepository.findTaskById(taskId);
        if (!task) throw new NotFoundError('프로젝트를 찾을 수 없습니다.');
    
        if (taskupdateDTO.members) {
            const members = await Promise.all(
                taskupdateDTO.members.map(async (member) => {
                    const user = await userRepository.getUserByName(member);
                    if (!user) {
                        throw new NotFoundError(`사용자를 찾을 수 없습니다: ${member}`);
                    }
                    return { uuid: user.uuid, name: user.name };
                })
            );
            const uniqueMembers = new Set();
            for (const member of members) {
                if (uniqueMembers.has(member.name)) {
                    throw new BadReqError(`중복된 사용자 이름 입니다: ${member.name}`);
                }
                uniqueMembers.add(member.name);
            }
            task.members = members;
        }
        const { members, ...rest } = taskupdateDTO;
        Object.assign(task, rest);
    
        const result = await taskRepository.updateTask(task);
        return new TaskResponseDTO(result);
    },
    deleteTask: async(taskId: number, userId: string) => {
        const user = await userRepository.getUserByUuid(userId);
        if(!user) throw new ForbiddenError("삭제할 권한이 없습니다");

        const task = await taskRepository.softDeleteTask(taskId);
        if (task.affected === 0) throw new NotFoundError('프로젝트를 찾을 수 없습니다.');
    }
};