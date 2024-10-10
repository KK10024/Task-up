import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AppError } from './AppError';

dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '1h';

if (!JWT_SECRET) {
    throw new AppError('JWT_SECRET 환경 변수가 설정되어 있지 않습니다.', 500);
}

interface TokenPayload {
    id: string;
}

export const generateToken = (userId: string): string => {
    return jwt.sign({ id: userId } as TokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): JwtPayload | null => {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            throw new AppError('유효하지 않은 토큰입니다.', 403);
        }
        throw new AppError('토큰 검증 중 오류가 발생했습니다.', 500);
    }
};
