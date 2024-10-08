import { Router } from "express";
import { userController } from "./user.controller";
import { validateSignup, handleValidationResult } from '../middleware/validation.middleware';

const router = Router();

// 회원가입 라우트
router.post('/signUp', validateSignup, handleValidationResult, userController.signUp);
router.post('/login', userController.signIn);

export const userRouter = router;