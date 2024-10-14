import { Router } from "express";
import { userController } from "./user.controller";
import { validateDto } from '../middleware/validation.middleware';
import { CreateUserDto, LoginUserDto } from "../dto/user.dto";
import { authenticateToken } from "../middleware/auth.token";

const router = Router();


router.post('/sign-up',validateDto(CreateUserDto), userController.signUp);
router.post('/sign-in',validateDto(LoginUserDto), userController.signIn);

router.post('/email-code',userController.verificationCode);

router.post('/password-reset', userController.passwordResetLink);
router.post('/password-reset/confirm', userController.passwordReset);

router.patch('/profile', authenticateToken, userController.updateUser);
router.delete('/profile', authenticateToken, userController.deleteUser);

export const userRouter = router;