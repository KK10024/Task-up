import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../util/jwt';  // 기존 JWT 유틸리티 파일
import { AppError, UnauthorizedError } from '../util/AppError';

export interface AuthenticatedRequest extends Request {
    user?: {
      id: string;
    };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1]; // 쿠키에서 토큰 추출
    if (!token) {
      return next(new UnauthorizedError('토큰이 없습니다. 접근이 거부되었습니다.'));
  }

try {
      const decoded = verifyToken(token);
      const userId = (decoded as { id: string }).id;
      
      req.user = { id: userId };
      next();
    } catch (e) {
      return next(e);
  }
};