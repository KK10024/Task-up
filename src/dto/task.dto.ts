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

export type TaskUpdateData = Partial<Pick<TaskDTO, 'title' | 'sub_title' | 'content' | 'status' | 'members' | 'startDate' | 'endDate'>>;

export class taskUpdateDTO {
    title?: string;
    sub_title?: string;
    content?: string;
    status?: TaskStatus;
    members?: string[];
    startDate?: Date;
    endDate?: Date;

    constructor(data: TaskUpdateData) {
        this.title = data.title;
        this.sub_title = data.sub_title;
        this.content = data.content;
        this.status = data.status;
        this.members = data.members;
        this.startDate = data.startDate;
        this.endDate = data.endDate;
    }
}

export class TaskResponseDTO {
    id: number;
    title: string;
    sub_title: string;
    content: string;
    status: TaskStatus;
    members: number[];
    startDate: Date;
    endDate: Date;
    user: {
        username: string;
    };

    constructor(task: any) {
        this.id = task.id;
        this.title = task.title;
        this.sub_title = task.sub_title;
        this.content = task.content;
        this.status = task.status;
        this.members = task.members;
        this.startDate = task.startDate;
        this.endDate = task.endDate;
        this.user = {
            username: task.user.name,
        };
    }
}