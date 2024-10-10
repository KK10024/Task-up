import { Router } from "express";
import { taskController } from "./task.controller";
import { authenticateToken } from '../middleware/auth.token';
const router = Router();

// 업무 프로젝트 라우트
router.post('/', authenticateToken, taskController.createTask);
router.get('/', taskController.readTask);
router.get('/:task_id', taskController.readOneTask);
router.put('/:task_id', taskController.updateTask);
router.delete('/:task_id', taskController.deleteTask);

export const taskRouter = router;