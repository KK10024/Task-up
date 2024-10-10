import { Request, Response, NextFunction } from 'express';
import {taskService} from './task.service';
import { createTaskDTO, taskUpdateDTO } from '../dto/task.dto';

export const taskController = {
    createTask: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const takscreateDTO: createTaskDTO = req.body;
            const result = await taskService.createTask(takscreateDTO);
            res.status(201).send({message:"생성 완료", data: result});
        } catch (e) {
            next(e);
        }
    },
    readTask: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await taskService.readTask();
            res.status(200).send({message:"조회 완료", data: result});
        } catch (e) {
            next(e);
        }
    },
    readOneTask: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {task_id} = req.params;
            const result = await taskService.readOneTask(Number(task_id));
            res.status(200).send({message:"조회 완료", data: result});
        } catch (e) {
            next(e);
        }
    },
    updateTask: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {task_id} = req.params;
            const taskupdateDTO: taskUpdateDTO = req.body;
            const result = await taskService.updateTask(Number(task_id), taskupdateDTO);
            res.status(200).send({message:"수정 완료", data: result});
        } catch (e) {
            next(e);
        }
    },
    deleteTask: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {task_id} = req.params;
            await taskService.deleteTask(Number(task_id));
            res.status(200).send({message:"삭제완료"})
        } catch (e) {
            next(e);
        }
    },
}