import { KoreanTime } from '../util/DateUtil';
import { TaskStatus } from '../entity/task.status';

export class TaskDTO {
    title: string;
    sub_title: string;
    content: string;
    status: TaskStatus;
    members: string[];
    startDate: Date;
    endDate: Date;
    user_id: string;
}

export class createTaskDTO extends TaskDTO { }
export interface ITask {
    title: string;
    sub_title: string;
    content: string;
    status: TaskStatus; 
    members: { 
        uuid: string;
        name: string; 
    }[]; 
    startDate: Date;
    endDate: Date;
    user: { uuid: string };
}

export class taskUpdateDTO {
    title?: string;
    sub_title?: string;
    content?: string;
    status?: TaskStatus;
    members?: {
        uuid: string; 
        name: string;
    }[];
    startDate?: Date;
    endDate?: Date;

    constructor(data: any) {
        this.title = data.title;
        this.sub_title = data.sub_title;
        this.content = data.content;
        this.status = data.status;

        // members를 배열로 처리
        this.members = data.members.map((member: any) => ({
            uuid: member.uuid,
            name: member.name,
            
        }));
        this.startDate = data.startDate;
        this.endDate = data.endDate;
    }
}


export class TaskResponseDTO {
    id: number;
    title: string;
    subTitle: string;
    content: string;
    status: TaskStatus;
    members: { name: string }[];
    startDate: Date;
    endDate: Date;
    author: { name: string };

    constructor(task: any) {
        this.id = task.id;
        this.title = task.title;
        this.subTitle = task.sub_title;
        this.content = task.content;
        this.status = task.status;
        this.startDate = KoreanTime(task.startDate);
        this.endDate = KoreanTime(task.endDate);
        this.members = task.members.map(member => member.name);
        this.author = task.user.name;
    }
}

// uuid만 받을 경우 이름 검색
// export const createTaskResponse = async(task: any, userRepository: any) => {
//     const members = await Promise.all(
//         task.members.map(async (member: { uuid: string }) => {
//             const user = await userRepository.getUserByUuid(member.uuid);
//             return { name: user.name };
//         })
//     );
//     const author = { name: task.user.name };
//     return new TaskResponseDTO(task, members, author);
// }

export class CalenderResDTO{
    id: number;
    title: string;
    startDate: Date;
    endDate: Date;
    constructor(calender: any){
        this.id = calender.id;
        this.title = calender.title;
        this.startDate = KoreanTime(calender.startDate);
        this.endDate = KoreanTime(calender.endDate);
    }
}