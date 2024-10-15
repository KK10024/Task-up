import { Request, Response, NextFunction } from 'express';
import {taskService} from './task.service';
import { createTaskDTO, taskUpdateDTO, calenderReqDTO } from '../dto/task.dto';
import { AppError } from '../util/AppError';
import { AuthenticatedRequest } from '../middleware/auth.token'; // req.user 타입 정의를 가져옴
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export const taskController = {
    createTask: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user.id;
            const taskCreateDTO: createTaskDTO = plainToInstance(createTaskDTO, req.body);
            taskCreateDTO.userId = userId;
            const errors = await validate(taskCreateDTO);
            if (errors.length > 0) {
                throw new AppError('잘못된 요청 데이터입니다.', 400);
            }
            const result = await taskService.createTask(taskCreateDTO);
            res.status(201).send({message:"생성 완료", data: result});
        } catch (e) {
            next(e);
        }
    },
    readTask: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = Number(req.query.page);
            const pageSize = Number(req.query.pageSize);
            const status = req.query.status ? req.query.status as string : undefined;

            // 페이지와 페이지 크기 유효성 검사
            if (isNaN(page) || page < 1) {
                throw new AppError('유효하지 않은 페이지 번호입니다.', 400)
            }
            if (isNaN(pageSize) || pageSize < 1) {
               throw new AppError('유효하지 않은 페이지 크기입니다.', 400)
            }
            
            const result = await taskService.readTask(page, pageSize, status);
            res.status(200).send({ message: "조회 완료", data: result });
        } catch (e) {
            next(e);
        }
    },
    readOneTask: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {taskId} = req.params;
            
            const result = await taskService.readOneTask(Number(taskId));
            res.status(200).send({message:"조회 완료", data: result});
        } catch (e) {
            next(e);
        }
    },
    calenderTask: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const calenderReqdto = plainToInstance(calenderReqDTO, req.query);
            const errors = await validate(calenderReqdto);
    
            if (errors.length > 0) {
                throw new AppError('잘못된 쿼리 형식입니다.', 400);
            }
            //날짜 포맷팅 ex) 2024-10-12 => 2024-10-12T00:00:00변환
            new Date(`${calenderReqdto.startDate}T00:00:00`); // 시작일 

            const result = await taskService.calenderTask(calenderReqdto);
            res.status(200).send({message:"일정 조회", data: result });
        } catch (e) {
            next(e);
        }
    },
    // getDueTasks: async(req: Request, res: Response, next: NextFunction)  => {
    //     try {
    //       const tasksDue = await taskService.getTasksDue(); // 서비스에서 기한 임박한 태스크 조회
    //       if (tasksDue.length > 0) {
    //         tasksDue.forEach(task => {
    //           // 알림 전송 로직 추가
    //           console.log(`Task Due: ${task.title} is due soon!`);
    //         });
    //       }
    //       res.status(200).json(tasksDue);
    //     } catch (e) {
    //         next(e);
    //     }
    // },
    updateTask: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {taskId} = req.params;
            const taskupdateDTO: taskUpdateDTO = req.body;
            const result = await taskService.updateTask(Number(taskId), taskupdateDTO);
            res.status(200).send({message:"수정 완료", data: result});
        } catch (e) {
            next(e);
        }
    },
    deleteTask: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {taskId} = req.params;
            await taskService.deleteTask(Number(taskId));
            res.status(200).send({message:"삭제완료"})
        } catch (e) {
            next(e);
        }
    },
}