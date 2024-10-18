import { KoreanTime } from '../util/DateUtil';
import { TaskStatus } from '../entity/task.status';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class TaskDTO {
    title: string;
    subTitle: string;
    content: string;
    status: TaskStatus;
    members: string[];
    startDate: Date;
    endDate: Date;
    userId: string;
}
export class createTaskDTO extends TaskDTO { 
    @IsString()
    title:string;
    @IsString()
    subTitle: string;
    @IsString()
    content: string;
}
export interface ITask {
    title: string;
    subTitle: string;
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
    subTitle?: string;
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
        this.subTitle = data.subTitle;
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
export class TaskQueryDTO {
    @IsNumber()
    @IsOptional()
    page?: number;
    
    @IsNumber()
    @IsOptional()
    pageSize?: number;

    @IsString()
    @IsOptional()
    status?: string;
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
        this.subTitle = task.subTitle;
        this.content = task.content;
        this.status = task.status;
        this.startDate = KoreanTime(task.startDate);
        this.endDate = KoreanTime(task.endDate);
        this.members = task.members.map(member => member.name);
        this.author = task.user.name;
    }
}

export class calenderReqDTO{
    @IsString()
    startDate: string;
    @IsString()
    type: string;
}

export class CalenderResDTO{
    id: number;
    title: string;
    name: string;
    startDate: Date;
    endDate: Date;
    constructor(calender: any){
        this.id = calender.id;
        this.title = calender.title;
        this.name = calender.user.name;
        this.startDate = KoreanTime(calender.startDate);
        this.endDate = KoreanTime(calender.endDate);
    }
}