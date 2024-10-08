import { Router } from "express";
import { taskController } from "./task.controller";

const router = Router();

// 업무 프로젝트 라우트
router.post('/');
router.get('/');
router.get('/:id');
router.put('/:id');
router.delete('/:id');

export const taskRouter = router;