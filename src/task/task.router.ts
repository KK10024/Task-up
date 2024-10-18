import { Router } from "express";
import { taskController } from "./task.controller";
import { authenticateToken } from '../middleware/auth.token';
import { validateDto } from "../middleware/validation.middleware";
import { createTaskDTO } from "../dto/task.dto";
const router = Router();

// 프로젝트 생성
router.post('/', authenticateToken, validateDto(createTaskDTO), taskController.createTask);
// 전체 프로젝트 조회
router.get('/', taskController.readTask);
//캘린더 일정 조회
router.get('/calender', taskController.calenderTask);
// 단건 프로젝트 조회
router.get('/:taskId', taskController.readOneTask); 
// 프로젝트 수정
router.patch('/:taskId', authenticateToken, taskController.updateTask); 
 // 프로젝트 삭제
router.delete('/:taskId', authenticateToken, taskController.deleteTask);

export const taskRouter = router;