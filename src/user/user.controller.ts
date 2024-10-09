import { userService } from "./user.service";
import { CreateUserDto, LoginUserDto } from '../dto/user.dto';
import { Request, Response, NextFunction } from 'express';


export const userController = {
    signUp: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const createUserDto: CreateUserDto = req.body;
            await userService.signUp(createUserDto);
            res.status(201).send({message:'회원가입 완료'});
        } catch (e) {
            return next(e);
        }
    },
    signIn: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const loginUserDto: LoginUserDto = req.body;
            const { token } = await userService.signIn(loginUserDto);
            //토큰 저장
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
    }
}