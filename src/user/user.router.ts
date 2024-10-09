import { Router } from "express";
import { userController } from "./user.controller";
import { validateDto } from '../middleware/validation.middleware';
import { CreateUserDto, LoginUserDto } from "../dto/user.dto";
const router = Router();

// 회원가입 라우트
router.post('/sign-up',validateDto(CreateUserDto), userController.signUp);
router.post('/sign-in',validateDto(LoginUserDto), userController.signIn);

export const userRouter = router;