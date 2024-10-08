import { userService } from "./user.service";
import { CreateUserDto, LoginUserDto } from '../dto/user.dto';
import { Request, Response, NextFunction } from 'express';


export const userController = {
    signUp: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const createUserDto: CreateUserDto = req.body;
            const result = await userService.signUp(createUserDto);
            
            res.status(201).send({message:'회원가입 완료', data:result});
        } catch (e) {
            return next(e);
        }
    },
    signIn: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const loginUserDto: LoginUserDto = req.body;
            const result = await userService.signIn(loginUserDto);
            res.status(200).send({message:'로그인 성공', data:result});
        } catch (e) {
            next(e);
        }
    }
}