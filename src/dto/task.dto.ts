import { KoreanTime } from '../util/DateUtil';
import { TaskStatus } from '../entity/task.status';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

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
    @IsNotEmpty({message: "제목은 필수입니다."})
    title:string;

    @IsString()
    @IsNotEmpty({message: "서브 제목은 필수입니다."})
    subTitle: string;

    @IsString()
    @IsNotEmpty({message: "내용은 필수입니다."})
    content: string;

    @IsString()
    @IsNotEmpty({message: "시작일은 필수입니다."})
    startDate: Date;

    @IsString()
    @IsNotEmpty({message: "종료일은 필수입니다."})
    endDate: Date;
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
    // members?: {
    //     uuid: string; 
    //     name: string;
    // }[];
    members:string[];
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
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    page?: number = 1;
    
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    pageSize?: number = 10;

    @Type(() => String)
    @IsString()
    @IsOptional()
    status?: string = TaskStatus.IN_PROGRESS;
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

export class CalenderReqDTO {
    @Type(() => String)
    @IsOptional()
    @IsString({ message: '쿼리 타입 에러' })
    startDate?: string;

    @Type(() => String)
    @IsOptional()
    @IsString({ message: '쿼리 타입 에러' })
    type?: string;
}
export class TaskParamsDTO {
    @Type(() => Number)
    @IsNumber()
    taskId: number;
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