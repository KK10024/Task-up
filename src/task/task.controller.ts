import { Request, Response, NextFunction } from 'express';
import {taskService} from './task.service';
import { createTaskDTO, taskUpdateDTO, CalenderReqDTO, TaskQueryDTO, TaskParamsDTO } from '../dto/task.dto';
import { AuthenticatedRequest } from '../middleware/auth.token';
import { plainToInstance } from 'class-transformer';

export const taskController = {
    createTask: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user.id;
            const taskCreateDTO = plainToInstance(createTaskDTO, req.body);
            taskCreateDTO.userId = userId;
            const result = await taskService.createTask(taskCreateDTO);
            res.status(201).send({message:"생성 완료", data: result});
        } catch (e) {
            next(e);
        }
    },
    readTask: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user.id;
            const taskQuery = plainToInstance(TaskQueryDTO, req.query);
            const result = await taskService.readTask(taskQuery, userId);
            res.status(200).send({ message: "조회 완료", data: result });
        } catch (e) {
            next(e);
        }
    },
    readOneTask: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const taskParams = plainToInstance(TaskParamsDTO, req.params);
            const result = await taskService.readOneTask(taskParams.taskId);
            res.status(200).send({message:"조회 완료", data: result});
        } catch (e) {
            next(e);
        }
    },
    calenderTask: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            const calenderReqdto = plainToInstance(CalenderReqDTO, req.query);
            const result = await taskService.calenderTask(calenderReqdto, userId);
            res.status(200).send({message:"일정 조회", data: result });
        } catch (e) {
            next(e);
        }
    },
    updateTask: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const taskParams = plainToInstance(TaskParamsDTO, req.params);
            const userId = req.user?.id;
            const taskupdateDTO: taskUpdateDTO = req.body;
            const result = await taskService.updateTask(taskParams.taskId, userId, taskupdateDTO);
            res.status(200).send({message:"수정 완료", data: result});
        } catch (e) {
            next(e);
        }
    },
    deleteTask: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const taskParams = plainToInstance(TaskParamsDTO, req.params);
            const userId = req.user?.id;
            await taskService.deleteTask(taskParams.taskId, userId);
            res.status(200).send({message:"삭제완료"})
        } catch (e) {
            next(e);
        }
    },
}