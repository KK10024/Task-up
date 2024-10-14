import { userService } from "./user.service";
import { CreateUserDto, LoginUserDto, UpdateUserDto } from '../dto/user.dto';
import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.token';
import { sendMail } from '../util/mailer'; // 이메일 전송 함수
import { AppError } from "../util/AppError";

// 스토리지에 저장 함 새로고침 시 날라가버림 방법 찾아야함
const verificationCodeStorage: { [email: string]: { code: string, expiresAt: number } } = {};

export const userController = {
    verificationCode: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;
            // 이메일코드 재발송 방지
            if (verificationCodeStorage[email]) {
                const storedData = verificationCodeStorage[email];
                if (storedData.expiresAt > Date.now()) {
                    throw new AppError("이미 인증코드가 발송되었습니다", 400);
                }
            }
            const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
            // 5분 유효
            const expiresAt = Date.now() + 5 * 60 * 1000;
    
            verificationCodeStorage[email] = { code: verificationCode, expiresAt };

            await sendMail(email, '이메일 인증 코드입니다.', `인증코드는: ${verificationCode}`);
    
            res.status(200).json({ message: `인증번호가 ${email}로 전송되었습니다.` });
        } catch (e) {
            return next(e);
        }
    },
    
    // 회원가입
    signUp: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const createuserDto : CreateUserDto = req.body;
            const {code} = req.body;
            const storedData = verificationCodeStorage[createuserDto.email];
            
            if (!storedData || storedData.expiresAt < Date.now()) {
                throw new AppError("인증 코드가 만료되었거나 유효하지 않습니다.", 400);
            }
    
            if (storedData.code !== code) {
                throw new AppError("유효한 코드를 입력해주세요.", 400);
            }
    
            delete verificationCodeStorage[createuserDto.email];
    
            await userService.signUp(createuserDto);
    
            res.status(201).send({ message: '회원가입 완료' });
        } catch (e) {
            return next(e);
        }
    },
    signIn: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const loginUserDto: LoginUserDto = req.body;
            const { token } = await userService.signIn(loginUserDto);
            //토큰 저장 ?? 이래도 되는건지 모름 찾아봐야함
            res.cookie('token', token, {
                httpOnly: true, // JavaScript에서 쿠키 접근 불가
                secure: process.env.NODE_ENV === 'production', // HTTPS에서만 전송, development: 개발 환경 production: 배포 환경 test: 테스트 환경
                sameSite: 'strict', // 같은 사이트 내에서만 쿠키 전송
                maxAge: 60 * 60 * 1000,  // 1시간 동안 유효
            });
            res.status(200).send({message:'로그인 성공'});
        } catch (e) {
            next(e);
        }
    },
    updateUser: async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user.id;
            const updateUserDto: UpdateUserDto = req.body;
            const result = await userService.updateUser(userId, updateUserDto);
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