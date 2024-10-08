import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AppError } from './AppError';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET; // 기본값 설정하지 않음
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

if (!JWT_SECRET) {
    throw new AppError('JWT_SECRET 환경 변수가 설정되어 있지 않습니다.', 500);
}
export const generateToken = (userId: number): string => {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): string | JwtPayload | null => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (e) {
        throw new AppError('유효하지 않은 토큰입니다.', 403);
    }
};