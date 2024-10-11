import { Router } from "express";
import { userController } from "./user.controller";
import { validateDto } from '../middleware/validation.middleware';
import { CreateUserDto, LoginUserDto } from "../dto/user.dto";
import { authenticateToken } from "../middleware/auth.token";

const router = Router();

router.post('/sign-up',validateDto(CreateUserDto), userController.signUp);
router.post('/sign-in',validateDto(LoginUserDto), userController.signIn);
router.patch('/', authenticateToken, userController.updateUser);
export const userRouter = router;