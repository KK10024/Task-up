import { Request, Response, NextFunction } from 'express';
import {taskService} from './task.service';
import { createTaskDTO, taskUpdateDTO, calenderReqDTO, TaskQueryDTO } from '../dto/task.dto';
import { AppError, BadReqError } from '../util/AppError';
import { AuthenticatedRequest } from '../middleware/auth.token';
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
                throw new BadReqError('잘못된 요청 데이터입니다.');
            }
            const result = await taskService.createTask(taskCreateDTO);
            res.status(201).send({message:"생성 완료", data: result});
        } catch (e) {
            next(e);
        }
    },
    readTask: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const taskQuery = new TaskQueryDTO();
            taskQuery.page = Number(req.query.page) || 1;
            taskQuery.pageSize = Number(req.query.pageSize) || 10;
            taskQuery.status = req.query.status as string;

            const errors = await validate(taskQuery);
            if (errors.length > 0) throw new BadReqError("유효하지않은 요청");

            const result = await taskService.readTask(taskQuery.page, taskQuery.pageSize, taskQuery.status);
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
                throw new BadReqError('잘못된 쿼리 형식입니다.');
            }
            const result = await taskService.calenderTask(calenderReqdto);
            res.status(200).send({message:"일정 조회", data: result });
        } catch (e) {
            next(e);
        }
    },
    updateTask: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const {taskId} = req.params;
            const userId = req.user?.id;
            const taskupdateDTO: taskUpdateDTO = req.body;
            const result = await taskService.updateTask(Number(taskId), userId, taskupdateDTO);
            res.status(200).send({message:"수정 완료", data: result});
        } catch (e) {
            next(e);
        }
    },
    deleteTask: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const {taskId} = req.params;
            const userId = req.user?.id;
            await taskService.deleteTask(Number(taskId), userId);
            res.status(200).send({message:"삭제완료"})
        } catch (e) {
            next(e);
        }
    },
}