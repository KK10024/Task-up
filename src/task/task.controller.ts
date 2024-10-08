import { Request, Response, NextFunction } from 'express';
import {taskService} from './task.service';
import { read } from 'fs';


export const taskController = {
    createTask: async (req:Request, res: Response, next: NextFunction) => {
        try {
            const {title, sub_title, content, userId} = req.body;
            const result = await taskService.createTask();
            res.status(201).send({message:"생성 완료", data: result});
        } catch (e) {
            next(e);
        }
    },
    readTask: async (req:Request, res: Response, next: NextFunction) => {
        try {
            const result = await taskService.readTask();
            res.status(200).send({message:"조회 완료", data: result});
        } catch (e) {
            next(e);
        }
    },
    readOneTask: async (req:Request, res: Response, next: NextFunction) => {
        try {
            const {id} = req.params;
            const result = await taskService.readOneTask();
            res.status(200).send({message:"조회 완료", data: result});
        } catch (e) {
            next(e);
        }
    },
    updateTask: async (req:Request, res: Response, next: NextFunction) => {
        try {
            const {id} = req.params;
            const {} = req.body;
            const result = await taskService.updateTask();
            res.status(200).send({message:"수정 완료", data: result});
        } catch (e) {
            next(e);
        }
    },
    deleteTask: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {id} = req.params;
            const result = await taskService.deleteTask();
            res.status(204).send({message:"삭제완료"})
        } catch (e) {
            next(e);
        }
    }
}