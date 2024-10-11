import { Router } from "express";
import { taskController } from "./task.controller";
import { authenticateToken } from '../middleware/auth.token';
const router = Router();

// 프로젝트 생성
router.post('/', authenticateToken, taskController.createTask);
// 전체 프로젝트 조회
router.get('/', taskController.readTask);
// 프로젝트 상태 조회 (진행중, 완료)
router.get('/task-status', taskController.readTasksByStatus);
//캘린더 일정 조회
router.get('/calender', taskController.calenderTask);
// 단건 프로젝트 조회
router.get('/:taskId', taskController.readOneTask); 
// 프로젝트 수정
router.patch('/:taskId', taskController.updateTask); 
 // 프로젝트 삭제
router.delete('/:taskId', taskController.deleteTask);

export const taskRouter = router;