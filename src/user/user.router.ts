import { Router } from "express";
import { userController } from "./user.controller";
import { CreateUserDto } from '../dto/user.dto';
import {validateDto} from '../middleware/validation.middleware'
const router = Router();

// 회원가입 라우트
router.post('/signUp', validateDto(CreateUserDto), userController.signUp);
router.post('/login', userController.signIn);

export const userRouter = router;