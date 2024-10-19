import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ForbiddenError, InternalServerError, UnauthorizedError } from './AppError';

dotenv.config();

export const jwtConfig = {
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    },
};

interface TokenPayload {
    id: string;
}

export const generateToken = (userId: string): string => {
    return jwt.sign({ id: userId } as TokenPayload, jwtConfig.jwt.secret!, { expiresIn: jwtConfig.jwt.expiresIn });
};

export const verifyToken = (token: string): JwtPayload | null => {
    try {
        return jwt.verify(token, jwtConfig.jwt.secret!) as JwtPayload;
    } catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
            throw new UnauthorizedError('토큰이 만료되었습니다.');
        }
        if (e instanceof jwt.JsonWebTokenError) {
            throw new ForbiddenError('유효하지 않은 토큰입니다.');
        }
        throw new InternalServerError('토큰 검증 중 오류가 발생했습니다.');
    }
};