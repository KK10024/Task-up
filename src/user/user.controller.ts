import { userService } from "./user.service";
import { CreateUserDto, LoginUserDto, UpdateUserDto } from '../dto/user.dto';
import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.token';
import { AppError, BadReqError } from "../util/AppError";


export const userController = {
    verificationCode: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;
            await userService.verificationCode(email);
            res.status(200).json({ message: `인증번호가 ${email}로 전송되었습니다.` });
        } catch (e) {
            return next(e);
        }
    },
    passwordResetLink: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;
            await userService.passwordResetLink(email);
            res.status(200).json({ message: `비밀번호 재설정 페이지가 ${email}로 전송되었습니다.` });
        } catch (e) {
            next(e)
        }
    },
    passwordReset: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {email, token, password, confirmPassword} = req.body;
            await userService.passwordReset(email, token, password, confirmPassword);
            res.status(200).json({message: "패스워드가 변경되었습니다."})
        } catch (e) {
            next(e)
        }
    },
    signUp: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const createuserDto : CreateUserDto = req.body;
            const {code} = req.body;
            await userService.signUp(createuserDto, code);
    
            res.status(201).send({ message: '회원가입 완료' });
        } catch (e) {
            next(e);
        }
    },
    signIn: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const loginUserDto: LoginUserDto = req.body;
            const { token , email, name} = await userService.signIn(loginUserDto);
            res.cookie('token', token, {
                httpOnly: true, // JavaScript에서 쿠키 접근 불가
                //secure: process.env.NODE_ENV === 'production', // HTTPS에서만 전송, development: 개발 환경 production: 배포 환경 test: 테스트 환경
                sameSite: 'none', // 같은 사이트 내에서만 쿠키 전송
                secure: true,
                maxAge: 60 * 60 * 1000,  // 1시간 동안 유효
            });
            res.status(200).send({message:'로그인 성공' , userinfo: {token}, user:{email, name}});
        } catch (e) {
            next(e);
        }
    },
    getUserProfile: async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user.id;
            const result = await userService.getUserProfile(userId);
            res.status(200).send({message:"회원 조회", data:result})
        } catch (e) {
            next(e);
        }
    },
    updateUser: async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.file) throw new BadReqError("파일경로 이슈")
            const userId = req.user.id;
            const imagePath = req.file.path;
            const updateUserDto: UpdateUserDto = req.body;
            await userService.updateUser(userId, imagePath, updateUserDto);
            res.status(200).send({message:"수정 완료"});
        } catch (e) {
            next(e);
        }
    },
    deleteUser: async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user.id;
            await userService.deleteUser(userId);
            res.status(200).send({massage:"탈퇴 완료"})
        } catch (e) {
            next(e);
        }
    }
}